(() => {
  const loginPage = 'login.html';
  const sessionEndpoint = 'api/session.php';

  document.documentElement.style.visibility = 'hidden';

  const revealPage = () => {
    document.documentElement.style.visibility = '';
  };

  const redirectToLogin = () => {
    window.location.replace(loginPage);
  };

  fetch(sessionEndpoint, {
    credentials: 'same-origin'
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Session check failed: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      if (!data || !data.authenticated) {
        redirectToLogin();
        return;
      }

      revealPage();
    })
    .catch(() => {
      redirectToLogin();
    });
})();