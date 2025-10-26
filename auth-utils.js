/**
 * Shared Authentication Utility Functions
 * For Skinship Beauty Website
 */

// Authentication utility functions
window.AuthUtils = {
    /**
     * Check if user is logged in
     * @returns {Object|null} User session data or null if not logged in
     */
    checkLoginStatus() {
        const session = sessionStorage.getItem('userSession');
        if (!session) {
            return null;
        }
        
        try {
            const userData = JSON.parse(session);
            if (userData.isLoggedIn) {
                return userData;
            }
        } catch (e) {
            console.error('Error parsing session data:', e);
            sessionStorage.removeItem('userSession');
        }
        
        return null;
    },

    /**
     * Get current user data
     * @returns {Object|null} User data or null if not logged in
     */
    getCurrentUser() {
        return this.checkLoginStatus();
    },

    /**
     * Check if user has specific role
     * @param {string} role - Role to check for
     * @returns {boolean} True if user has the role
     */
    hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    },

    /**
     * Check if user is customer
     * @returns {boolean} True if user is customer
     */
    isCustomer() {
        return this.hasRole('customer');
    },

    /**
     * Check if user is admin
     * @returns {boolean} True if user is admin
     */
    isAdmin() {
        return this.hasRole('admin');
    },

    /**
     * Check if user is staff
     * @returns {boolean} True if user is staff
     */
    isStaff() {
        return this.hasRole('staff');
    },

    /**
     * Check if user is admin or staff
     * @returns {boolean} True if user is admin or staff
     */
    isAdminOrStaff() {
        return this.isAdmin() || this.isStaff();
    },

    /**
     * Logout user and clear session
     */
    logout() {
        sessionStorage.removeItem('userSession');
        sessionStorage.removeItem('sessionId');
        sessionStorage.removeItem('userId');
        localStorage.removeItem('currentUserRole');
        window.currentUserData = null;
    },

    /**
     * Redirect to login page
     */
    redirectToLogin() {
        window.location.href = 'login.html';
    },

    /**
     * Redirect to dashboard (for admin/staff)
     */
    redirectToDashboard() {
        window.location.href = 'dashboard.html';
    },

    /**
     * Redirect to home page
     */
    redirectToHome() {
        window.location.href = 'index.html';
    },

    /**
     * Handle Book Now button click
     * Redirects to login if not authenticated, otherwise to contact page
     */
    handleBookNow() {
        const user = this.getCurrentUser();
        if (user) {
            window.location.href = 'contact.html';
        } else {
            this.redirectToLogin();
        }
    },

    /**
     * Protect a page - redirect to login if not authenticated
     * @param {string} redirectUrl - URL to redirect to if not authenticated (default: login.html)
     */
    protectPage(redirectUrl = 'login.html') {
        const user = this.getCurrentUser();
        if (!user) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    },

    /**
     * Update header UI based on login status
     * @param {string} loginButtonId - ID of login button element
     * @param {string} profileIconId - ID of profile icon element
     * @param {string} userNameDisplayId - ID of user name display element
     */
    updateHeaderUI(loginButtonId = 'loginButton', profileIconId = 'profileIcon', userNameDisplayId = 'userNameDisplay') {
        const loginButton = document.getElementById(loginButtonId);
        const profileIcon = document.getElementById(profileIconId);
        const userNameDisplay = document.getElementById(userNameDisplayId);
        
        if (!loginButton || !profileIcon) {
            console.warn('Header elements not found');
            return;
        }

        const user = this.getCurrentUser();
        
        if (user) {
            if (loginButton) loginButton.style.display = 'none';
            if (profileIcon) profileIcon.style.display = 'block';
            if (userNameDisplay) userNameDisplay.textContent = user.fullName || 'User';
        } else {
            if (loginButton) loginButton.style.display = 'block';
            if (profileIcon) profileIcon.style.display = 'none';
        }
    },

    /**
     * Toggle profile dropdown
     * @param {string} dropdownId - ID of dropdown element
     */
    toggleDropdown(dropdownId = 'dropdownMenu') {
        const dropdown = document.getElementById(dropdownId);
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        }
    },

    /**
     * Close dropdown when clicking outside
     * @param {string} profileIconId - ID of profile icon element
     * @param {string} dropdownId - ID of dropdown element
     */
    setupDropdownClose(profileIconId = 'profileIcon', dropdownId = 'dropdownMenu') {
        document.addEventListener('click', function(event) {
            const profileIcon = document.getElementById(profileIconId);
            const dropdown = document.getElementById(dropdownId);
            
            if (profileIcon && dropdown && !profileIcon.contains(event.target)) {
                dropdown.style.display = 'none';
            }
        });
    }
};

// Auto-setup dropdown close functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    AuthUtils.setupDropdownClose();
});
