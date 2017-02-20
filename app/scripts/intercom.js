(function() {
  var w = window;
  var ic = w.Intercom;
  if (typeof ic === 'function') {
    ic('reattach_activator');
    ic('update', intercomSettings);
  } else {
    var d = document;
    var i = function() {
      i.c(arguments)
    };
    i.q = [];
    i.c = function(args) {
      i.q.push(args)
    };
    w.Intercom = i;

    function l() {
      var s = d.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = 'https://widget.intercom.io/widget/uiel53cc';
      var x = d.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
    }
    if (w.attachEvent) {
      w.attachEvent('onload', l);
    } else {
      w.addEventListener('load', l, false);
    }
  }
})();

$(document).ready(function() {
  if (sessionStorage.sessionStorage_intercom_employeee_id) {

    console.group('INTERCOM FOR LOGGED-IN USERS');

    // Get saved data from sessionStorage
    var sessionStorage_intercom_employeee_id = sessionStorage.getItem('sessionStorage_intercom_employeee_id');
    var sessionStorage_intercom_employeee_name = sessionStorage.getItem('sessionStorage_intercom_employeee_name');
    var sessionStorage_intercom_employeee_email = sessionStorage.getItem('sessionStorage_intercom_employeee_email');
    var sessionStorage_intercom_employeee_created_at = sessionStorage.getItem('sessionStorage_intercom_employeee_created_at');

    // // Shutdown 'INTERCOM FOR GUESTS' mode
    // console.warn('Shutting down Intercom for logged-out visitors');
    // window.Intercom('shutdown');

    // Initialize Intercom for logged-in users
    console.info('Initializing Intercom for logged-in users');

    console.log('User ID: ' + sessionStorage_intercom_employeee_id);
    console.log('Full name: ' + sessionStorage_intercom_employeee_name);
    console.log('Email address: ' + sessionStorage_intercom_employeee_email);
    console.log('Signup date: ' + sessionStorage_intercom_employeee_created_at);

    window.Intercom('update', {
      app_id: 'uiel53cc',
      user_id: sessionStorage_intercom_employeee_id,
      name: sessionStorage_intercom_employeee_name,
      email: sessionStorage_intercom_employeee_email,
      created_at: sessionStorage_intercom_employeee_created_at
    });

    // Remove all saved data from sessionStorage
    sessionStorage.clear();

    console.groupEnd();


  } else {

    // console.group('INTERCOM FOR GUESTS');
    // console.log('Initializing Intercom');
    // window.Intercom('boot', {
    //   app_id: 'uiel53cc'
    // });
    // console.groupEnd();

  }
});
