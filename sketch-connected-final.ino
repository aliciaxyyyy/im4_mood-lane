/******************************************************************************************
 * Emotion RFID System – ESP32-C6
 * 
 * Zusammenfassung:
 * Dieses Programm liest NFC-Tags mit einem PN532 Reader aus. Jeder Tag steht
 * für eine Emotion oder ein Kindprofil. Bei einem Scan leuchtet die eingebaute
 * RGB-LED in der Emotionsfarbe und die Daten werden per HTTP POST als JSON
 * an einen PHP-Server gesendet, der sie in einer Datenbank speichert.
 * 
 * Ablauf: Profil-Chip scannen → Emotions-Chip scannen → Daten werden
 * dem richtigen Kind zugeordnet und gespeichert.
 * 
 * Benötigte Libraries: Adafruit PN532, Arduino_JSON
 ******************************************************************************************/
#include <Wire.h>
#include <Adafruit_PN532.h> // PN532 NFC/RFID Reader
#include <WiFi.h>// WLAN Verbindung
#include <HTTPClient.h> // HTTP POST Requests
#include <Arduino_JSON.h> // JSON Objekte erstellen

// ── NETZWERK & SERVER ─────────────────────────

const char* ssid      = "iPhone von Natacha Krenger"; // WLAN Name
const char* pass      = "nati0111"; // WLAN Passwort
const char* serverURL = "https://moodlane.aliciagregorini.com/api/load.php"; // PHP Endpoint
const char* DEVICE_ID = "emotion-box-01"; // Geräte-ID

#define PN532_SDA  6 // I2C Datenleitung zum PN532
#define PN532_SCL  7 // I2C Taktleitung zum PN532
#define PN532_IRQ  9 // Interrupt Pin (optional)
#define PN532_RST  8 // Reset Pin (optional)

int led = LED_BUILTIN; // Eingebaute RGB-LED des ESP32-C6

// ── KINDERPROFILE ─────────────────────────────
// 7-Byte UIDs der Profil-Chips (werden zuerst gescannt)
uint8_t profilKind1[7] = {0x04, 0x53, 0xC5, 0x27, 0x21, 0x02, 0x89};
uint8_t profilKind2[7] = {0x04, 0xE3, 0x9E, 0x20, 0x21, 0x02, 0x89};
String aktivesKind = "unbekannt"; // Speichert das aktuell aktive Kindprofil

// ── DATENSTRUKTUR FÜR EMOTIONS-TAGS ──────────
struct EmotionTag {
  uint8_t uid[7]; // UID des NFC-Tags (bis zu 7 Bytes)
  uint8_t uidLength; // Länge der UID
  String  emotion; // Name der Emotion
  String  color; // Hex-Farbwert für die Datenbank
  uint8_t r, g, b; // RGB-Werte für die eingebaute LED
};

EmotionTag emotions[] = {
  {{0xBB, 0x92, 0xD7, 0x48}, 4, "Freude",        "#FFD700", 255, 200,   0},  // gelb
  {{0xBB, 0x92, 0xE2, 0x48}, 4, "Trauer",        "#00008B",   0,   0, 139},  // dunkelblau
  {{0xBB, 0x92, 0xE1, 0x48}, 4, "Wut",           "#FF0000", 255,   0,   0},  // rot
  {{0xBB, 0x92, 0xD9, 0x48}, 4, "Angst",         "#8B00FF", 139,   0, 255},  // violett
  {{0xBB, 0x92, 0xDF, 0x48}, 4, "Neutral",       "#FFFFFF", 255, 255, 255},  // weiss
  {{0xBB, 0x92, 0xE0, 0x48}, 4, "Ueberraschung", "#FF00AA", 255,   0, 170},  // pink
  {{0xBB, 0x92, 0xD8, 0x48}, 4, "Stolz",         "#FF6000", 255,  96,   0},  // orange
  {{0xBB, 0x92, 0xDA, 0x48}, 4, "Ekel",          "#00CC00",   0, 204,   0},  // grün
};

// ── EMOTIONS-TAGS MIT FARBZUORDNUNG ──────────
// 8 Tags, je einer Emotion und Farbe zugeordnet
// RGB-Werte: r=Rot, g=Grün, b=Blau (0-255)
const int NUM_EMOTIONS = sizeof(emotions) / sizeof(EmotionTag); // Anzahl Emotions-Tags
Adafruit_PN532 nfc(PN532_IRQ, PN532_RST); // NFC Reader Objekt

// Speichert den zuletzt gescannten Tag (verhindert Doppelscans)
uint8_t lastUID[7] = {0};
uint8_t lastUIDLen = 0;

// ── SETUP ─────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(1000);
   // LED rot = System startet
  pinMode(led, OUTPUT);
  rgbLedWrite(led, 0, 255, 0);  // rot = startet
// I2C und NFC Reader initialisieren
  Wire.begin(PN532_SDA, PN532_SCL);
  nfc.begin();
// Prüfen ob PN532 erreichbar ist
  uint32_t ver = nfc.getFirmwareVersion();
  if (!ver) { Serial.println("PN532 nicht gefunden!"); while(1); }
  nfc.SAMConfig();
  Serial.println("NFC bereit!");

  connectWiFi();
}

// ── HAUPTSCHLEIFE ─────────────────────────────
void loop() {
  uint8_t uid[7], uidLen;
  // Auf NFC-Tag warten (100ms Timeout)
  bool tagPresent = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLen, 100);
  // Kein Tag vorhanden → LED hellblau (bereit) und Zustand zurücksetzen
  if (!tagPresent) {
    lastUIDLen = 0;
    memset(lastUID, 0, 7);
    rgbLedWrite(led, 180, 20, 255);  // hellblau = bereit (GRB)
    return;
  }
// Gleicher Tag wie beim letzten Scan → ignorieren (kein Doppelscan)
  if (memcmp(uid, lastUID, uidLen)==0 && uidLen==lastUIDLen) return;
// Neuen Tag als letzten Scan speichern
  memcpy(lastUID, uid, uidLen);
  lastUIDLen = uidLen;
// UID Bytes in lesbaren String umwandeln (z.B. "BB:92:D7:48")
  String uidStr = "";
  for (uint8_t i=0; i<uidLen; i++) {
    if(uid[i]<0x10) uidStr+="0";
    uidStr+=String(uid[i],HEX);
    if(i<uidLen-1) uidStr+=":";
  }
  uidStr.toUpperCase();
  // ── Profil-Tag erkannt? ──────────────────────
  // Profil-Chips haben 7-Byte UIDs und setzen das aktive Kind
  if (uidLen==7 && memcmp(uid, profilKind1, 7)==0) {
    aktivesKind = uidStr;
    rgbLedWrite(led, 255, 255, 255);  // weiss = Profil gescannt
    delay(1000);
    rgbLedWrite(led, 180, 20, 255);   // zurück zu hellblau
    Serial.println("========================");
    Serial.println("Profil aktiv: Kind 1");
    Serial.println("========================");
    return;
  }
  if (uidLen==7 && memcmp(uid, profilKind2, 7)==0) {
    aktivesKind = uidStr;
    rgbLedWrite(led, 255, 255, 255);  // weiss = Profil gescannt
    delay(1000);
    rgbLedWrite(led, 180, 20, 255);   // zurück zu hellblau
    Serial.println("========================");
    Serial.println("Profil aktiv: Kind 2");
    Serial.println("========================");
    return;
  }
  // ── Emotions-Tag erkannt? ────────────────────
  // Tag mit bekannter UID suchen und Emotion + Farbe auslesen
  String emotion="unbekannt", color="#808080";
  uint8_t r=50, g=50, b=50;
  for (int i=0; i<NUM_EMOTIONS; i++) {
    if (emotions[i].uidLength==uidLen && memcmp(emotions[i].uid,uid,uidLen)==0) {
      emotion = emotions[i].emotion;
      color   = emotions[i].color;
      r = emotions[i].r;
      g = emotions[i].g;
      b = emotions[i].b;
      break;
    }
  }
  // LED in Emotionsfarbe leuchten lassen
  // Achtung: ESP32-C6 RGB-LED verwendet GRB statt RGB!
  rgbLedWrite(led, g, r, b);
// Scan-Ergebnis im Serial Monitor ausgeben
  Serial.println("------------------------");
  Serial.println("Kind:     " + aktivesKind);
  Serial.println("Emotion:  " + emotion);
  Serial.println("Tag UID:  " + uidStr);
  // ── Daten als JSON an Server senden ──────────
  JSONVar dataObject;
  dataObject["uid"]       = uidStr.c_str();
  dataObject["emotion"]   = emotion.c_str();
  dataObject["color"]     = color.c_str();
  dataObject["kind"]      = aktivesKind.c_str();
  dataObject["device_id"] = DEVICE_ID;
  String jsonString = JSON.stringify(dataObject);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverURL);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(jsonString);
    if (httpResponseCode > 0) {
      Serial.printf("HTTP Response code: %d\n", httpResponseCode);
      Serial.println("Response: " + http.getString());
    } else {
      Serial.printf("Fehler beim Senden: %d\n", httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("WiFi getrennt – reconnect...");
    connectWiFi();
  }

  Serial.println("------------------------");
}

// ── WLAN VERBINDEN ────────────────────────────
// Versucht bis zu 40x (20 Sekunden) eine WLAN-Verbindung herzustellen
void connectWiFi() {
  Serial.printf("\nVerbinde mit WLAN %s", ssid);
  WiFi.begin(ssid, pass);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 40) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("\nWiFi verbunden: IP: %s\n", WiFi.localIP().toString().c_str());
    rgbLedWrite(led, 180, 20, 255);  // hellblau = verbunden (GRB)
  } else {
    Serial.println("\nWiFi Verbindung fehlgeschlagen!");
  }
}