const headings = {
      login:  { title: 'Welcome back',    sub: 'Sign in to your HomeVibes account' },
      signup: { title: 'Create account',  sub: 'Join HomeVibes and start cooking' }
    };

    function showTab(tab, btn) {
      document.querySelectorAll('form').forEach(f => f.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById(tab).classList.add('active');
      btn.classList.add('active');
      document.querySelector('.form-title').textContent = headings[tab].title;
      document.querySelector('.form-sub').textContent   = headings[tab].sub;
    }

    function registerUser(e) {
      e.preventDefault();
      const email = document.getElementById('signupEmail').value.trim().toLowerCase();
      const user = {
        name:     document.getElementById('signupName').value.trim(),
        dob:      document.getElementById('signupDob').value,
        email:    email,
        password: document.getElementById('signupPassword').value
      };
      // Store accounts as a map keyed by email so multiple users are supported
      const accounts = JSON.parse(localStorage.getItem('hv_accounts') || '{}');
      accounts[email] = user;
      localStorage.setItem('hv_accounts', JSON.stringify(accounts));
      // Also keep 'user' for backward compatibility with other pages
      localStorage.setItem('user', JSON.stringify(user));
      showToast('✓ Account created! Please log in.');
      document.getElementById('signup').reset();
      document.querySelector('.tab-btn').click();
    }

    function loginUser(e) {
      e.preventDefault();
      const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;

      // Check multi-user accounts first
      const accounts = JSON.parse(localStorage.getItem('hv_accounts') || '{}');
      const stored   = accounts[email] || JSON.parse(localStorage.getItem('user') || 'null');

      if (stored && stored.email.toLowerCase() === email && stored.password === password) {
        // Save who is currently logged in
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('currentUserEmail', email);
        // Set 'user' to the logged-in user so all pages can read it
        localStorage.setItem('user', JSON.stringify(stored));

        // Clear only the session/cart — never touch profile/addresses/orders
        localStorage.removeItem('cart');
        localStorage.removeItem('order');
        localStorage.removeItem('paymentMethod');
        localStorage.removeItem('hv_buyNow');
        localStorage.removeItem('hv_checkoutSource');

        // Load THIS user's profile data into the active keys
        const userKey = email.replace(/[^a-z0-9]/g, '_');
        const savedProfile   = localStorage.getItem(`hv_profile_${userKey}`);
        const savedAddresses = localStorage.getItem(`hv_addresses_${userKey}`);
        const savedPrefs     = localStorage.getItem(`hv_prefs_${userKey}`);
        const savedStats     = localStorage.getItem(`hv_stats_${userKey}`);
        const savedHistory   = localStorage.getItem(`hv_orderHistory_${userKey}`);

        // Write user's own data into the active keys that all pages read
        if (savedProfile)   localStorage.setItem('hv_profile',   savedProfile);
        else                localStorage.removeItem('hv_profile');

        if (savedAddresses) localStorage.setItem('hv_addresses', savedAddresses);
        else                localStorage.removeItem('hv_addresses');

        if (savedPrefs)     localStorage.setItem('hv_prefs',     savedPrefs);
        else                localStorage.removeItem('hv_prefs');

        if (savedStats)     localStorage.setItem('hv_stats',     savedStats);
        else                localStorage.removeItem('hv_stats');

        if (savedHistory)   localStorage.setItem('orderHistory', savedHistory);
        else                localStorage.removeItem('orderHistory');

        showToast('✓ Logged in! Redirecting…');
        setTimeout(() => { window.location.href = 'home.html'; }, 1000);
      } else {
        showToast('✗ Invalid email or password.');
      }
    }

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 3000);
    }