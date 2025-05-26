console.log('Auth button exists:', !!document.querySelector('.auth-button'));
console.log('Auth modal exists:', !!document.getElementById('auth-modal'));

const firebaseConfig = {
  apiKey: "AIzaSyBODDB2vFcc1sB4k4t-WtsC9UWCbUrfhNI",
  authDomain: "h-ice-95499.firebaseapp.com",
  projectId: "h-ice-95499",
  storageBucket: "h-ice-95499.firebasestorage.app",
  messagingSenderId: "181060979212",
  appId: "1:181060979212:web:832fbbc73197ce5649fc29",
  measurementId: "G-P3VXBDW5JW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log('Firebase initialized:', firebase.apps.length > 0);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();
const accountForm = document.getElementById('account-form');
const accountContent = document.getElementById('account-content');
const accountLoading = document.getElementById('account-loading');
const editAccountBtn = document.getElementById('edit-account');

// Modal functionality
const authButton = document.querySelector('.auth-button');
const authModal = document.getElementById('auth-modal');
const accountModal = document.getElementById('account-modal');
const closeModal = document.querySelector('.close-modal');
const closeAccountModal = document.querySelector('.close-account-modal');
const tabButtons = document.querySelectorAll('.tab-button');
const authForms = document.querySelectorAll('.auth-form');
const logoutButton = document.getElementById('logout-button');
let comingFromAccountModal = false;
let isAccountModalOpen = false;

// Debug check
console.log("Auth button:", authButton);

// Auth state listener
auth.onAuthStateChanged(user => {
  console.log('Auth state changed:', user); // Debug
  
  if (user) {
      // User is logged in
      authButton.textContent = 'Account';
      authButton.onclick = (e) => {
          e.preventDefault();
          isAccountModalOpen = true;
          accountModal.style.display = 'flex';
          setTimeout(() => {
              accountModal.classList.add('show');
              loadAccountData(user);
          }, 10);
      };
  } else {
      // User is logged out
      authButton.textContent = 'Login/Signup';
      authButton.onclick = (e) => {
          e.preventDefault();
          if (!isAccountModalOpen) {
              authModal.style.display = 'flex';
              setTimeout(() => {
                  authModal.classList.add('show');
                  showLoginForm();
              }, 10);
          }
          isAccountModalOpen = false;
      };
  }
});

// account modal close handler
closeModal.addEventListener('click', () => {
  authModal.classList.remove('show');
  setTimeout(() => {
      authModal.style.display = 'none';
  }, 300);
});

closeAccountModal.addEventListener('click', () => {
  isAccountModalOpen = false;
  accountModal.classList.remove('show');
  setTimeout(() => {
      accountModal.style.display = 'none';
  }, 300);
});

// Show login/signup form function
function showLoginForm() {
  document.getElementById('login-form').classList.add('active-form');
  document.getElementById('signup-form').classList.remove('active-form');
  tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === 'login');
  });
}

// Reusable Modal Functionality
function setupModal(modal, trigger, close) {
    // Open modal when trigger is clicked
    if (trigger) {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            void modal.offsetWidth; 
            modal.classList.add('show'); 
        });
    }

    // Close modal when close button is clicked
    if (close) {
        close.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300); // Matches the fade-out transition duration
        });
    }

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    });
}

// Logout button functionality
logoutButton.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut()
      .then(() => {
          alert('You have been logged out.');
          accountModal.style.display = 'none'; 
      })
      .catch((error) => {
          console.error('Logout error:', error.message);
          alert('An error occurred while logging out. Please try again.');
      });
});

// Setup modals
setupModal(authModal, null, closeModal); 
setupModal(accountModal, null, closeAccountModal); 

// Form toggle functionality
document.getElementById('show-signup').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form').classList.remove('active-form');
    document.getElementById('signup-form').classList.add('active-form');
});

document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('signup-form').classList.remove('active-form');
    document.getElementById('login-form').classList.add('active-form');
});

// Forgot password functionality
document.getElementById('forgot-password').addEventListener('click', (e) => {
    e.preventDefault();
    const email = prompt("Please enter your email to reset password:");
    if (email) {
        auth.sendPasswordResetEmail(email)
            .then(() => alert("Password reset email sent!"))
            .catch(err => alert("Error: " + err.message));
    }
});

// Create login confirmation modal
const loginConfirmationModal = document.createElement('div');
loginConfirmationModal.className = 'modal confirmation-modal';
loginConfirmationModal.innerHTML = `
  <div class="modal-content confirmation-content">
    <div class="confirmation-icon">✓</div>
    <h2>Login Successful!</h2>
    <p>Welcome back to H-ICE!</p>
    <div class="confirmation-details">
      <p>You can now access your account and place orders.</p>
    </div>
    <button class="confirmation-close">Close</button>
  </div>
`;
document.body.appendChild(loginConfirmationModal);

// Create signup confirmation modal
const signupConfirmationModal = document.createElement('div');
signupConfirmationModal.className = 'modal confirmation-modal';
signupConfirmationModal.innerHTML = `
  <div class="modal-content confirmation-content">
    <div class="confirmation-icon">✓</div>
    <h2>Account Created!</h2>
    <p>Welcome to H-ICE!</p>
    <div class="confirmation-details">
      <p>Your account has been successfully created.</p>
      <p>You can now log in and start ordering.</p>
    </div>
    <button class="confirmation-close">Close</button>
  </div>
`;
document.body.appendChild(signupConfirmationModal);

// Close confirmation modals
const closeLoginConfirmation = loginConfirmationModal.querySelector('.confirmation-close');
const closeSignupConfirmation = signupConfirmationModal.querySelector('.confirmation-close');

closeLoginConfirmation.addEventListener('click', () => {
  loginConfirmationModal.classList.remove('show');
  setTimeout(() => {
    loginConfirmationModal.style.display = 'none';
  }, 300);
});

closeSignupConfirmation.addEventListener('click', () => {
  signupConfirmationModal.classList.remove('show');
  setTimeout(() => {
    signupConfirmationModal.style.display = 'none';
  }, 300);
});

// Login and Signup functionality
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const loginSpinner = document.getElementById('login-spinner');
  const signupSpinner = document.getElementById('signup-spinner');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      // Show loading state
      const submitButton = loginForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Logging in...';
      submitButton.disabled = true;

      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          authModal.style.display = 'none';
          loginForm.reset();
          
          // Show confirmation modal
          loginConfirmationModal.style.display = 'flex';
          setTimeout(() => {
            loginConfirmationModal.classList.add('show');
          }, 10);
        })
        .catch(err => {
          document.getElementById('login-error').textContent = err.message;
        })
        .finally(() => {
          // Reset button state
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;
        });
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('signup-confirm').value;

      if (password !== confirmPassword) {
        document.getElementById('signup-error').textContent = "Passwords do not match.";
        return;
      }

      // Show loading state
      const submitButton = signupForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Creating Account...';
      submitButton.disabled = true;

      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          signupForm.reset();
          authModal.style.display = 'none';
          
          // Show confirmation modal
          signupConfirmationModal.style.display = 'flex';
          setTimeout(() => {
            signupConfirmationModal.classList.add('show');
          }, 10);
        })
        .catch((error) => {
          document.getElementById('signup-error').textContent = error.message;
        })
        .finally(() => {
          // Reset button state
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;
        });
    });
  }
});

// Function to load account data
function loadAccountData(user) {
  accountLoading.style.display = 'block';
  accountContent.style.display = 'none';
  
  db.collection('users').doc(user.uid).get()
      .then(doc => {
          if (doc.exists) {
              // Populate form with existing data
              const data = doc.data();
              document.getElementById('account-name').value = data.name || '';
              document.getElementById('account-phone').value = data.phone || '';
              document.getElementById('account-address').value = data.address || '';
              
              // Switch to view mode initially
              switchToViewMode();
          } else {
              // New user - switch to edit mode
              switchToEditMode();
          }
      })
      .catch(error => {
          console.error("Error loading account data:", error);
          alert("Error loading account data. Please try again.");
      })
      .finally(() => {
          accountLoading.style.display = 'none';
          accountContent.style.display = 'block';
      });
}

// Form submission handler
if (accountForm) {
accountForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const user = auth.currentUser;
  if (!user) return;
  
  const accountData = {
      name: document.getElementById('account-name').value,
      phone: document.getElementById('account-phone').value,
      address: document.getElementById('account-address').value,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
  };
  
  accountLoading.style.display = 'block';
  
  db.collection('users').doc(user.uid).set(accountData, { merge: true })
      .then(() => {
          alert("Account information saved successfully!");
          switchToViewMode();
      })
      .catch(error => {
          console.error("Error saving account data:", error);
          alert("Error saving account data. Please try again.");
      })
      .finally(() => {
          accountLoading.style.display = 'none';
      });
});
}

// Edit button handler
if (editAccountBtn) {
  editAccountBtn.addEventListener('click', () => {
  switchToEditMode();
});
}

// View/edit mode functions
function switchToViewMode() {
  accountContent.classList.add('view-mode');
  accountContent.classList.remove('edit-mode');
  editAccountBtn.style.display = 'block';
  accountForm.querySelector('button[type="submit"]').style.display = 'none';
}

function switchToEditMode() {
  accountContent.classList.add('edit-mode');
  accountContent.classList.remove('view-mode');
  editAccountBtn.style.display = 'none';
  accountForm.querySelector('button[type="submit"]').style.display = 'block';
  
  // Focus on first field
  document.getElementById('account-name').focus();
}

// Update auth state listener to load account data
auth.onAuthStateChanged(user => {
    console.log('Auth state changed:', user); // Debug

  if (user) {
      authButton.textContent = 'Account';
      authButton.onclick = (e) => {
          e.preventDefault();
          accountModal.style.display = 'flex';
          void accountModal.offsetWidth; // Trigger reflow
              accountModal.classList.add('show');
              loadAccountData(user); // Load data when modal opens         
      };
  } else {
      authButton.textContent = 'Login/Signup';
      authButton.onclick = (e) => {
          e.preventDefault();
          if (!isAccountModalOpen){
            authModal.style.display = 'flex';
            void accountModal.offsetWidth;
            authModal.classList.add('show');
            showLoginForm();
          }
          isAccountModalOpen = false;        
      };
  }
});

// Get flavor modal elements
const modal = document.getElementById('flavorModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalTagline = document.getElementById('modalTagline');
const modalPrice = document.getElementById('modalPrice');
const modalDescription = document.getElementById('modalDescription');
const closeBtn = document.querySelector('.close-btn');

// All flavor images
const flavorImages = document.querySelectorAll('.flavor-image');

// Flavor Pop-up data
const flavors = {
  chocolate: {
    title: 'Chocolate',
    tagline: 'Rich, creamy, and undeniably indulgent.',
    image: 'chocolateicecream.jpg',
    price: '₱49 / scoop',
    description: 'Dive into the ultimate chocolate experience! Made with premium cocoa, this is the perfect balance of smooth, creamy texture and bold, rich flavor. 🍫 Decadent | 🍦 Silky | ❤️ Love at First Bite. A chocolate lover\'s dream come true.',
    className: 'chocolate'
  },
  blueberry: {
    title: 'Blueberry',
    tagline: 'Cool, fruity freshness with a burst of blueberry chill.',
    image: 'blueberryicecream.jpg',
    price: '₱49 / scoop',
    description: 'Fresh blueberry meets icy goodness in this fruity and refreshing flavor that\'s as bold as it is beautiful. 🫐 Tart-Sweet | ❄️ Refreshing | 💙 Playfully Cool One scoop and you\'re hooked on blue.',
    className: 'blueberry'
  },
  banana: {
    title: 'Banana',
    tagline: 'Creamy and mellow with a tropical banana twist.',
    image: 'bananaicecream.jpg',
    price: '₱49 / scoop',
    description: 'Creamy banana with a soft yellow hue and a gentle tropical sweetness. 🍌 Naturally Sweet | 🌴 Tropical | 🍦 Soft & Light Simple, happy, and always a-peeling.',
    className: 'banana'
  },
  matcha: {
    title: 'Matcha',
    tagline: 'Earthy green tea flavor with a calm, creamy vibe.',
    image: 'matchaicecream.jpg',
    price: '₱49 / scoop',
    description: 'Our matcha flavor is earthy, balanced, and lightly bitter — perfectly paired with a creamy base.<br><br> 🍃 Subtle | 🍵 Sophisticated | 💚 Calming<br><br> It\'s not just ice cream. It\'s a vibe.',
    className: 'matcha'
  },
  strawberry: {
    title: 'Strawberry',
    tagline: 'A sweet and fruity classic with a berry soft touch.',
    image: 'strawberryicecream.jpg',
    price: '₱49 / scoop',
    description: 'Welcome to the Berry Side! Our strawberry ice cream is made with real strawberries and blended into a creamy, pastel-pink treat that\'s as sweet as it looks. 🍓 Fruity | 🍦 Smooth | 🌸 Light & Lovely<br><br> Every bite is like a spoonful of sunshine.',
    className: 'strawberry'
  },
  vanilla: {
    title: 'Vanilla',
    tagline: 'Simple, elegant, and endlessly creamy vanilla delight.',
    image: 'vanillaicecream.jpg',
    price: '₱49 / scoop',
    description: 'Elegant, smooth, and far from boring — our vanilla is crafted with care to bring you the perfect base for any craving. 🌼 Creamy | 🍯 Aromatic | 🎨 Pure & Versatile Sometimes, the simplest things taste the best.',
    className: 'vanilla'
  }
};

// Change cursor to pointer
flavorImages.forEach(img => {
  img.style.cursor = 'pointer';
});

// When a flavor is clicked
flavorImages.forEach(img => {
  img.addEventListener('click', () => {
    const flavorKey = img.getAttribute('data-flavor');
    const flavor = flavors[flavorKey];

    modalImage.src = flavor.image;
    modalTitle.textContent = flavor.title;
    modalTagline.textContent = flavor.tagline;
    modalPrice.textContent = flavor.price;
    modalDescription.innerHTML = flavor.description;

    // Add the respective colors per flavor
    modal.classList.remove(
      'chocolate-modal', 'blueberry-modal', 'banana-modal', 'matcha-modal', 'strawberry-modal', 'vanilla-modal'
    );
    modal.classList.add(`${flavorKey}-modal`); 

    openModal(); 
  });
});

// open the flavor with animation
function openModal() {
    modal.style.display = 'flex'; 
    setTimeout(function() {
        modal.classList.add('show'); 
    }, 10);
}

// close the flavor with animation
if (closeBtn) {
closeBtn.addEventListener('click', function() {
    modal.classList.remove('show'); 
    setTimeout(function() {
        modal.style.display = 'none'; 
    }, 500); 
});
}

//close flavor modal
window.addEventListener('click', (e) => {
  if (e.target == modal) {
    modal.classList.remove('show'); 
    setTimeout(function() {
        modal.style.display = 'none'; 
    }, 500); 
  }
});

// Get customer email
document.addEventListener('DOMContentLoaded', () => {
  const emailGroup = document.getElementById('customer-email-group');
  const customerEmailInput = document.getElementById('customer-email');

  auth.onAuthStateChanged(user => {
    if (emailGroup) {
      if (user) {
        emailGroup.style.display = 'none';
        if (customerEmailInput) customerEmailInput.required = false;
      } else { 
        emailGroup.style.display = '';
        if (customerEmailInput) customerEmailInput.required = true;
      }
    }
  });
});

document.addEventListener('DOMContentLoaded',() => {
  if (window.location.pathname.endsWith('orderform.html')) {
    auth.onAuthStateChanged(user => {
      if (user) {
        db.collection('users').doc(user.uid).get().then(doc => {
          if (doc.exists) {
            const data = doc.data();
            if (document.getElementById('name')) {
              document.getElementById('name').value = data.name || '';
            }
            if (document.getElementById('address')) {
              document.getElementById('address').value = data.address || '';
            }
            if (document.getElementById('contact')) {
              document.getElementById('contact').value = data.phone || '';
            }
          } else {
            console.log('No user data found in firestore')
          }
        });
      } else {
        console.log('User not logged in');
      }
    });
  }
});

// Payment modal logic
document.addEventListener('DOMContentLoaded', () => {
  const paymentModal = document.getElementById('payment-modal');
  const closePaymentModal = document.querySelector('.close-payment-modal');
  const proceedBtn = document.querySelector('.order-form-buttons button[type="submit"]');
  const editOrderBtn = document.getElementById('edit-order-btn');
  const paymentForm = document.getElementById('payment-form');
  const orderForm = document.getElementById('order-form');
  const fileInput = document.getElementById('payment-proof');
  const fileLabel = document.querySelector('.custom-file-upload');

  // Create confirmation modal
  const confirmationModal = document.createElement('div');
  confirmationModal.className = 'modal confirmation-modal';
  confirmationModal.innerHTML = `
    <div class="modal-content confirmation-content">
      <div class="confirmation-icon">✓</div>
      <h2>Order Confirmed!</h2>
      <p>Your order has been successfully placed.</p>
      <div class="confirmation-details">
        <p>We will process your order shortly.</p>
        <p>You will receive a confirmation email with your order details.</p>
      </div>
      <button class="confirmation-close">Close</button>
    </div>
  `;
  document.body.appendChild(confirmationModal);

  // Update file upload label when file is selected
  if (fileInput && fileLabel) {
    fileInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        fileLabel.textContent = this.files[0].name;
      } else {
        fileLabel.textContent = 'Choose Image';
      }
    });
  }

  // Show payment modal
if (proceedBtn && paymentModal) {
  proceedBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (orderForm.checkValidity()) {
      paymentModal.style.display = 'flex';
      setTimeout(() => {
        paymentModal.classList.add('show');
      }, 10);
    } else {
      orderForm.reportValidity();
      alert('Please fill out all required fields before proceeding.');
    }
  });
}

// Close modal (button)
if (closePaymentModal) {
  closePaymentModal.addEventListener('click', () => {
    paymentModal.classList.remove('show');
    setTimeout(() => {
      paymentModal.style.display = 'none';
    }, 300);
  });
}
if (editOrderBtn) {
  editOrderBtn.addEventListener('click', () => {
    paymentModal.classList.remove('show');
    setTimeout(() => {
      paymentModal.style.display = 'none';
    }, 300);
  });
}

// Close modal by clicking outside content
window.addEventListener('click', (e) => {
  if (e.target === paymentModal) {
    paymentModal.classList.remove('show');
    setTimeout(() => {
      paymentModal.style.display = 'none';
    }, 300);
  }
});

  // Close confirmation modal
  const confirmationClose = confirmationModal.querySelector('.confirmation-close');
  confirmationClose.addEventListener('click', () => {
    confirmationModal.classList.remove('show');
    setTimeout(() => {
      confirmationModal.style.display = 'none';
    }, 300);
  });

  // payment form submission
  if (paymentForm) {
    paymentForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Show loading state
      const submitButton = paymentForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Processing...';
      submitButton.disabled = true;

      try {
        // Collect and sanitize order form data
        const name = document.getElementById('name').value.trim();
        const address = document.getElementById('address').value.trim();
        const contact = document.getElementById('contact').value.trim();
        const flavor = document.getElementById('flavor').value.trim();
        const quantity = document.getElementById('quantity').value.trim();
        const note = document.getElementById('note').value.trim() || 'No special requests';
        const fileInput = document.getElementById('payment-proof');
        const file = fileInput.files[0];

        //Get customer email
        let customerEmail = '';
        if (auth.currentUser) {
          customerEmail = auth.currentUser.email.trim();
        } else {
          customerEmail = document.getElementById('customer-email').value.trim();
        }

        // Convert and compress image to base64
        let imageBase64 = '';
        if (file) {
          try {
            imageBase64 = await compressAndConvertToBase64(file);
          } catch (error) {
            alert('Error processing image. Please try a smaller image or different format.');
            return;
          }
        }

        // Prepare email data with sanitized values
        const emailData = {
          to_email: '2023302524@dhvsu.edu.ph',
          name: name.replace(/[<>]/g, ''),
          address: address.replace(/[<>]/g, ''),
          contact: contact.replace(/[<>]/g, ''),
          flavor: flavor.replace(/[<>]/g, ''),
          quantity: quantity.replace(/[<>]/g, ''),
          note: note.replace(/[<>]/g, ''),
          image: imageBase64,
          time: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        };

        // Send emails
        await emailjs.send('service_t9zgs3n', 'template_zrlgnjd', emailData);
        await emailjs.send('service_t9zgs3n', 'template_zrlgnjd', {
          ...emailData,
          to_email: 'markadriandizon936@gmail.com'
        });
        await emailjs.send('service_t9zgs3n', 'template_zrlgnjd', {
          ...emailData,
          to_email: customerEmail,
          isOwner: false,
          thankYouMessage: `Thank you for your order, ${name}! We will process it as soon as possible.`
        });

        // Save to Firestore
        await saveOrderToFirestore({
          name,
          address,
          contact,
          flavor,
          quantity,
          note,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Close payment modal
        paymentModal.classList.remove('show');

        // Show confirmation modal
        confirmationModal.style.display = 'flex';
        setTimeout(() => {
          confirmationModal.classList.add('show');
        }, 10);

        // Reset forms
        orderForm.reset();
        paymentForm.reset();
        if (fileLabel) fileLabel.textContent = 'Choose Image';

      } catch (error) {
        console.error('Error:', error);
        alert('Failed to process order: ' + error.text);
      } finally {
        // Reset button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      }
    });
  }
});

// Fetch and display order history in account modal
function loadOrderHistory() {
  const user = auth.currentUser;
  const orderHistoryList = document.getElementById('order-history-list');
  
  if (!user) {
    console.log('No user logged in');
    return;
  }
  
  if (!orderHistoryList) {
    console.log('Order history list element not found');
    return;
  }

  orderHistoryList.innerHTML = '<div class="empty-state">Loading...</div>';
  
  console.log('Loading orders for user:', user.uid);
  
  db.collection('users').doc(user.uid).collection('orders')
    .orderBy('timestamp', 'desc')
    .limit(10)
    .get()
    .then(snapshot => {
      console.log('Orders fetched:', snapshot.size);
      
      if (snapshot.empty) {
        console.log('No orders found');
        orderHistoryList.innerHTML = '<div class="empty-state">No orders yet.</div>';
        return;
      }
      
      let html = '<ul class="order-history-list-ul">';
      snapshot.forEach(doc => {
        const order = doc.data();
        console.log('Order data:', order);
        html += `<li class="order-history-item">
          <strong>${order.flavor}</strong> x${order.quantity} <br>
          <span>${order.name}</span> | <span>${order.address}</span><br>
          <span>${order.timestamp ? new Date(order.timestamp.seconds * 1000).toLocaleString() : ''}</span>
        </li>`;
      });
      html += '</ul>';
      orderHistoryList.innerHTML = html;
    })
    .catch(err => {
      console.error('Error loading orders:', err);
      orderHistoryList.innerHTML = '<div class="empty-state">No orders yet.</div>';
    });
}

// Update saveOrderToFirestore to include better error handling
function saveOrderToFirestore(orderData) {
  if (!auth.currentUser) {
    console.log('No user logged in, cannot save order');
    return Promise.reject('No user logged in');
  }
  
  const user = auth.currentUser;
  console.log('Saving order for user:', user.uid);
  console.log('Order data:', orderData);
  
  return db.collection('users').doc(user.uid).collection('orders')
    .add(orderData)
    .then(docRef => {
      console.log('Order saved with ID:', docRef.id);
      return docRef;
    })
    .catch(err => {
      console.error('Error saving order:', err);
      throw err;
    });
}

// Call loadOrderHistory when account modal is opened and user is logged in
if (accountModal) {
  accountModal.addEventListener('transitionend', function(e) {
    if (accountModal.classList.contains('show') && auth.currentUser) {
      loadOrderHistory();
    }
  });
}

// Contact form submission
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        console.log('Contact form found');

        // Auto-fill contact form if user is logged in
        auth.onAuthStateChanged(user => {
            if (user) {
                db.collection('users').doc(user.uid).get().then(doc => {
                    if (doc.exists) {
                        const data = doc.data();
                        if (document.getElementById('contact-name')) {
                            document.getElementById('contact-name').value = data.name || '';
                        }
                        if (document.getElementById('contact-phone')) {
                            document.getElementById('contact-phone').value = data.phone || '';
                        }
                    }
                });
            }
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            
            const name = document.getElementById('contact-name').value.trim();
            const phone = document.getElementById('contact-phone').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            console.log('Form data:', { name, phone, message });

            if (!name || !phone || !message) {
                alert('Please fill in all fields');
                return;
            }

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Prepare email data
            const emailData = {
                to_email: 'hicecreamz@gmail.com',
                name: name.replace(/[<>]/g, ''),
                phone: phone.replace(/[<>]/g, ''),
                message: message.replace(/[<>]/g, ''),
                time: new Date().toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })
            };

            // Send email using EmailJS
            emailjs.send('service_t9zgs3n', 'template_qjsjm67', emailData)
                .then(() => {
                    // Send confirmation to customer
                    const customerEmailData = {
                        ...emailData,
                        to_email: auth.currentUser ? auth.currentUser.email : emailData.phone,
                        isCustomer: true
                    };
                    return emailjs.send('service_t9zgs3n', 'template_qjsjm67', customerEmailData);
                })
                .then(() => {
                    alert('Message sent successfully! We will get back to you soon.');
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error('Email error:', error);
                    alert('Failed to send message. Please try again or contact us directly at hicecreamz@gmail.com');
                })
                .finally(() => {
                    // Reset button state
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                });
        });
    } else {
        console.log('Contact form not found');
    }
});

// Function to compress and convert image to base64
async function compressAndConvertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        const maxDimension = 800; // Maximum width or height
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with reduced quality
        const base64 = canvas.toDataURL('image/jpeg', 0.6);
        
        // Check if the compressed image is still too large
        if (base64.length > 45000) { // Leave some room for other data
          reject(new Error('Image too large even after compression'));
        } else {
          resolve(base64);
        }
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

// Fade-in-up for flavor and gallery items
function revealItemsOnScroll() {
  document.querySelectorAll('.fade-in-up-item').forEach(item => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      item.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealItemsOnScroll);
window.addEventListener('DOMContentLoaded', revealItemsOnScroll);