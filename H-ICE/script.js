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

// Show login form function
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
          accountModal.style.display = 'none'; // Close the account modal
      })
      .catch((error) => {
          console.error('Logout error:', error.message);
          alert('An error occurred while logging out. Please try again.');
      });
});

// Setup modals
setupModal(authModal, null, closeModal); // Auth modal
setupModal(accountModal, null, closeAccountModal); // Account modal

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

          loginSpinner.style.display = 'block';

          auth.signInWithEmailAndPassword(email, password)
              .then(() => {
                  authModal.style.display = 'none';
                  loginForm.reset();
              })
              .catch(err => {
                  document.getElementById('login-error').textContent = err.message;
              })
              .finally(() => {
                
                loginSpinner.style.display = 'none';
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

          signupSpinner.style.display = 'block';

          auth.createUserWithEmailAndPassword(email, password)
              .then((userCredential) => {
                  alert('Account created successfully!');
                  signupForm.reset();
                  authModal.style.display = 'none';
              })
              .catch((error) => {
                  document.getElementById('signup-error').textContent = error.message;
              })
              .finally(() => {
                signupSpinner.style.display = 'none';
              });
      });
  }
});

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

// Get modal elements
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
    description: 'Fresh blueberry meets icy goodness in this fruity and refreshing flavor that’s as bold as it is beautiful. 🫐 Tart-Sweet | ❄️ Refreshing | 💙 Playfully Cool One scoop and you\'re hooked on blue.',
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
    description: 'Our matcha flavor is earthy, balanced, and lightly bitter — perfectly paired with a creamy base.<br><br> 🍃 Subtle | 🍵 Sophisticated | 💚 Calming<br><br> It’s not just ice cream. It’s a vibe.',
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

    // Add the respective class to change colors based on flavor
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

window.addEventListener('click', (e) => {
  if (e.target == modal) {
    modal.classList.remove('show'); 
    setTimeout(function() {
        modal.style.display = 'none'; 
    }, 500); // Matches the duration of the fade-out transition (500ms)
  }
});

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

document.addEventListener('DOMContentLoaded', () => {
  // Payment modal logic
  const paymentModal = document.getElementById('payment-modal');
  const closePaymentModal = document.querySelector('.close-payment-modal');
  const proceedBtn = document.querySelector('.order-form-buttons button[type="submit"]');
  const editOrderBtn = document.getElementById('edit-order-btn');
  const paymentForm = document.getElementById('payment-form');
  const orderForm = document.getElementById('order-form');

  // Show payment modal instead of submitting form
  if (proceedBtn && paymentModal) {
    proceedBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (orderForm.checkValidity()) {
      paymentModal.classList.add('show');
      } else {
        orderForm.reportValidity();
        alert('Please fill out all required fields before proceeding.');
      }
    });
  }

  // Close modal on X or Edit Order
  if (closePaymentModal) {
    closePaymentModal.addEventListener('click', () => paymentModal.classList.remove('show'));
  }
  if (editOrderBtn) {
    editOrderBtn.addEventListener('click', () => paymentModal.classList.remove('show'));
  }

  // Handle payment form submission
  if (paymentForm) {
    paymentForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Collect order form data
      const name = document.getElementById('name').value;
      const address = document.getElementById('address').value;
      const contact = document.getElementById('contact').value;
      const flavor = document.getElementById('flavor').value;
      const quantity = document.getElementById('quantity').value;
      const note = document.getElementById('note').value;
      const fileInput = document.getElementById('payment-proof');
      const file = fileInput.files[0];

      //Get customer email
      let customerEmail = '';
      if (auth.currentUser) {
        customerEmail = auth.currentUser.email;
      } else {
        customerEmail = document.getElementById('customer-email').value;
      }

      // Convert image to base64
      let imageBase64 = '';
      if (file) {
        imageBase64 = await toBase64(file);
      }

      // Email to be sent to owner 
      emailjs.send('service_t9zgs3n', 'template_zrlgnjd', {
        to_email: '2023302524@dhvsu.edu.ph',
        name,
        address,
        contact,
        flavor,
        quantity,
        note,
        image: imageBase64
      }).then(() => {
      emailjs.send('service_t9zgs3n', 'template_zrlgnjd', {
        to_email: 'markadriandizon936@gmail.com',
        name,
        address,
        contact,
        flavor,
        quantity,
        note,
        image: imageBase64
      }).then(() => {
      // Email to be sent to customer
        emailjs.send('service_t9zgs3n', 'template_qjsjm67', {
          to_email: customerEmail,
          name,
          address,
          contact,
          flavor,
          quantity,
          note,
          image: imageBase64
        });
      }).then(() => {
        alert('Order sent! We will contact you soon.');
        paymentModal.classList.remove('show');
        document.querySelector('form').reset();
        paymentForm.reset();
      }, (error) => {
        alert('Failed to send order: ' + error.text);
      });
    });
  });

  // Helper to convert file to base64
  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      });
    }
  }
});