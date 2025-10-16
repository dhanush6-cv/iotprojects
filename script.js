function searchProjects() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let projects = document.getElementsByClassName("project-item");

  for (let i = 0; i < projects.length; i++) {
    let title = projects[i].getElementsByTagName("h3")[0].innerText.toLowerCase();
    if (title.includes(input)) {
      projects[i].style.display = "";
    } else {
      projects[i].style.display = "none";
    }
  }
}
// Profile Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const profileTrigger = document.getElementById('profileTrigger');
    const profileModal = document.getElementById('profileModal');
    const closeModal = document.getElementById('closeModal');
    const uploadGallery = document.getElementById('uploadGallery');
    const uploadCamera = document.getElementById('uploadCamera');
    const fileInput = document.getElementById('fileInput');
    const largeProfileImage = document.getElementById('largeProfileImage');
    const defaultProfile = document.getElementById('defaultProfile');
    const profileIcon = document.getElementById('profileIcon');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userEmailDisplay = document.getElementById('userEmailDisplay');

    // Load user data
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        userNameDisplay.textContent = user.username || 'User Name';
        userEmailDisplay.textContent = user.email || 'user@example.com';
        
        // Update small profile icon
        if (user.profilePhoto) {
            profileIcon.style.display = 'none';
            profileTrigger.innerHTML = `<img src="http://localhost:5000/uploads/${user.profilePhoto}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            
            // Update large profile image
            largeProfileImage.src = `http://localhost:5000/uploads/${user.profilePhoto}`;
            largeProfileImage.style.display = 'block';
            defaultProfile.style.display = 'none';
        }
    }

    // Open Modal
    profileTrigger.addEventListener('click', function() {
        profileModal.style.display = 'block';
    });

    // Close Modal
    closeModal.addEventListener('click', function() {
        profileModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === profileModal) {
            profileModal.style.display = 'none';
        }
    });

    // Upload from Gallery
    uploadGallery.addEventListener('click', function() {
        fileInput.click();
    });

    // Take Photo (Camera)
    uploadCamera.addEventListener('click', function() {
        alert('Camera functionality would open here!');
        // For actual camera: navigator.mediaDevices.getUserMedia({ video: true })
    });

    // File Input Change (Image Selected)
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Update large profile view
                largeProfileImage.src = e.target.result;
                largeProfileImage.style.display = 'block';
                defaultProfile.style.display = 'none';
                
                // Update small profile circle
                profileIcon.style.display = 'none';
                profileTrigger.innerHTML = `<img src="${e.target.result}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                
                // Upload to server (optional)
                uploadProfilePhoto(file);
            };
            
            reader.readAsDataURL(file);
        }
    });

    // Upload profile photo to server
    async function uploadProfilePhoto(file) {
        const formData = new FormData();
        formData.append('profilePhoto', file);
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/upload-profile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            
            const result = await response.json();
            if (response.ok) {
                console.log('Profile photo updated successfully');
                // Update local storage
                const user = JSON.parse(localStorage.getItem('user'));
                user.profilePhoto = result.profilePhoto;
                localStorage.setItem('user', JSON.stringify(user));
            }
        } catch (error) {
            console.error('Error uploading profile photo:', error);
        }
    }

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
});
// Add these to your existing JavaScript

// Bottom auth buttons functionality
const registerBottomBtn = document.getElementById('registerBottomBtn');
const googleBottomBtn = document.getElementById('googleBottomBtn');
const loginBottomBtn = document.getElementById('loginBottomBtn');
const logoutBottomBtn = document.getElementById('logoutBottomBtn');

// Register bottom button
registerBottomBtn.addEventListener('click', function() {
    window.location.href = 'register.html';
});

// Google bottom button
googleBottomBtn.addEventListener('click', function() {
    // Simulate Google login
    localStorage.setItem('isLoggedIn', 'true');
    checkLoginStatus();
    closeAllModals();
    alert('Logged in with Google! 🎉');
});

// Login bottom button
loginBottomBtn.addEventListener('click', function() {
    window.location.href = 'login.html';
});

// Logout bottom button
logoutBottomBtn.addEventListener('click', function() {
    localStorage.setItem('isLoggedIn', 'false');
    checkLoginStatus();
    closeAllModals();
    alert('Logged out successfully! 👋');
});

// Update login status for bottom buttons
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        document.body.classList.add('logged-in');
    } else {
        document.body.classList.remove('logged-in');
    }
}