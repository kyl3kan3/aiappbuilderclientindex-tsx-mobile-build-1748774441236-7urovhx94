import React from 'react';

// Converted from JavaScript
/**
 * Firebase Authentication Service for React Native
 *
 * Implements the AuthService interface using Firebase Authentication.
 */
import auth from '@react-native-firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Authentication states
export const AuthState = {
  UNKNOWN: 'unknown',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  IN_PROGRESS: 'in-progress',
  ERROR: 'error'
};

// Authentication providers
export const AuthProvider = {
  APPLE: 'apple',
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
  GITHUB: 'github',
  EMAIL_PASSWORD: 'email-password'
};

// Default authentication configuration
export const DEFAULT_AUTH_CONFIG = {
  requireEmailVerification: true,
  passwordMinLength: 8,
  passwordRequireSpecialChars: true,
  passwordRequireNumbers: true,
  passwordRequireUppercase: true,
  sessionDuration: 60 * 24, // 1 day in minutes
  allowMultipleDevices: true,
  lockoutAfterFailures: 5,
  useSecureStorage: true,
  useHttpsOnly: true,
  enableMFA: false
};

class FirebaseAuthService {
  constructor(config = DEFAULT_AUTH_CONFIG) {
    this.config = config;
    this.unsubscribeAuthStateChanged = null;
    this.authStateCallback = null;
  }

  // MARK: - User Authentication

  /**
   * Sign up a new user with email and password
   */
  async signUp(email, password, displayName = null) {
    try {
      // Validate password
      this._validatePassword(password);

      // Create user
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      
      // Update profile if display name is provided
      if (displayName) {
        await userCredential.user.updateProfile({
          displayName
        });
      }
      
      // Send email verification if required
      if (this.config.requireEmailVerification) {
        await userCredential.user.sendEmailVerification();
      }
      
      return this._mapToAuthResult(userCredential.user, null);
    } catch (error) {
      console.error('Sign up error:', error);
      return this._mapToAuthResult(null, error);
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email, password) {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return this._mapToAuthResult(userCredential.user, null);
    } catch (error) {
      console.error('Sign in error:', error);
      return this._mapToAuthResult(null, error);
    }
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    try {
      await auth().signOut();
      await this._clearStoredCredentials();
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error(`Failed to sign out: ${error.message}`);
    }
  }

  // MARK: - Password Management

  /**
   * Send password reset email
   */
  async resetPassword(email) {
    try {
      await auth().sendPasswordResetEmail(email);
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error(`Failed to reset password: ${error.message}`);
    }
  }

  /**
   * Update user password
   */
  async updatePassword(currentPassword, newPassword) {
    try {
      const user = auth().currentUser;
      
      if (!user) {
        throw new Error('User is not authenticated');
      }
      
      if (!user.email) {
        throw new Error('User has no email address to reauthenticate with');
      }
      
      // Validate new password
      this._validatePassword(newPassword);
      
      // Reauthenticate before changing password
      const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
      await user.reauthenticateWithCredential(credential);
      
      // Update password
      await user.updatePassword(newPassword);
      return true;
    } catch (error) {
      console.error('Update password error:', error);
      throw new Error(`Failed to update password: ${error.message}`);
    }
  }

  // MARK: - User Management

  /**
   * Get the current authenticated user
   */
  async getCurrentUser() {
    const user = auth().currentUser;
    return user ? this._mapToUser(user) : null;
  }

  /**
   * Update user profile information
   */
  async updateUserProfile(profile) {
    try {
      const user = auth().currentUser;
      
      if (!user) {
        throw new Error('User is not authenticated');
      }
      
      const updateData = {};
      
      if (profile.displayName !== undefined) {
        updateData.displayName = profile.displayName;
      }
      
      if (profile.photoURL !== undefined) {
        updateData.photoURL = profile.photoURL;
      }
      
      // Update profile
      if (Object.keys(updateData).length > 0) {
        await user.updateProfile(updateData);
      }
      
      // Update email if needed
      if (profile.email && profile.email !== user.email) {
        await user.updateEmail(profile.email);
        
        // Send verification email for new address
        if (this.config.requireEmailVerification) {
          await user.sendEmailVerification();
        }
      }
      
      // Reload user to get updated data
      await user.reload();
      return this._mapToUser(auth().currentUser);
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  /**
   * Delete the current user account
   */
  async deleteUser(password = null) {
    try {
      const user = auth().currentUser;
      
      if (!user) {
        throw new Error('User is not authenticated');
      }
      
      // Reauthenticate if password provided
      if (password && user.email) {
        const credential = auth.EmailAuthProvider.credential(user.email, password);
        await user.reauthenticateWithCredential(credential);
      }
      
      await user.delete();
      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  // MARK: - Email Verification

  /**
   * Send email verification to current user
   */
  async sendEmailVerification() {
    try {
      const user = auth().currentUser;
      
      if (!user) {
        throw new Error('User is not authenticated');
      }
      
      await user.sendEmailVerification();
      return true;
    } catch (error) {
      console.error('Send email verification error:', error);
      throw new Error(`Failed to send email verification: ${error.message}`);
    }
  }

  /**
   * Check if current user's email is verified
   */
  async checkEmailVerification() {
    try {
      const user = auth().currentUser;
      
      if (!user) {
        throw new Error('User is not authenticated');
      }
      
      // Reload user to get latest verification status
      await user.reload();
      return auth().currentUser.emailVerified;
    } catch (error) {
      console.error('Check email verification error:', error);
      throw new Error(`Failed to check email verification: ${error.message}`);
    }
  }

  // MARK: - Phone Authentication

  /**
   * Link phone number to current user account
   */
  async linkPhoneNumber(phoneNumber) {
    // This is a placeholder for phone authentication
    // Implementation would depend on your specific requirements
    console.warn('Phone authentication not implemented in this template');
    return false;
  }

  /**
   * Verify phone number with SMS code
   */
  async verifyPhoneNumber(phoneNumber, code) {
    // This is a placeholder for phone authentication
    // Implementation would depend on your specific requirements
    console.warn('Phone authentication not implemented in this template');
    return false;
  }

  // MARK: - Social Authentication

  /**
   * Sign in with a social provider
   */
  async signInWithProvider(provider) {
    try {
      let result;
      
      switch (provider) {
        case AuthProvider.APPLE:
          result = await this._signInWithApple();
          break;
        case AuthProvider.GOOGLE:
          result = await this._signInWithGoogle();
          break;
        case AuthProvider.FACEBOOK:
          result = await this._signInWithFacebook();
          break;
        default:
          throw new Error(`Provider ${provider} not supported`);
      }
      
      return result;
    } catch (error) {
      console.error(`Sign in with ${provider} error:`, error);
      return this._mapToAuthResult(null, error);
    }
  }

  /**
   * Link a social provider to current user account
   */
  async linkProvider(provider) {
    // This is a placeholder for provider linking
    // Implementation would depend on your specific requirements
    console.warn('Provider linking not implemented in this template');
    return false;
  }

  // MARK: - Authentication State

  /**
   * Subscribe to authentication state changes
   */
  onAuthStateChanged(callback) {
    if (this.unsubscribeAuthStateChanged) {
      this.unsubscribeAuthStateChanged();
    }
    
    this.authStateCallback = callback;
    
    this.unsubscribeAuthStateChanged = auth().onAuthStateChanged(user => {
      if (this.authStateCallback) {
        this.authStateCallback(user ? this._mapToUser(user) : null);
      }
    });
    
    // Return function to unsubscribe
    return () => {
      if (this.unsubscribeAuthStateChanged) {
        this.unsubscribeAuthStateChanged();
        this.unsubscribeAuthStateChanged = null;
        this.authStateCallback = null;
      }
    };
  }

  // MARK: - Token Management

  /**
   * Get ID token for current user
   */
  async getIdToken(forceRefresh = false) {
    try {
      const user = auth().currentUser;
      
      if (!user) {
        return null;
      }
      
      return await user.getIdToken(forceRefresh);
    } catch (error) {
      console.error('Get ID token error:', error);
      throw new Error(`Failed to get ID token: ${error.message}`);
    }
  }

  // MARK: - Multi-factor Authentication

  /**
   * Enable multi-factor authentication
   */
  async enableMFA() {
    // This is a placeholder for MFA
    // Implementation would depend on your specific requirements
    console.warn('MFA not implemented in this template');
    return false;
  }

  /**
   * Disable multi-factor authentication
   */
  async disableMFA() {
    // This is a placeholder for MFA
    // Implementation would depend on your specific requirements
    console.warn('MFA not implemented in this template');
    return false;
  }

  /**
   * Verify MFA code
   */
  async verifyMFA(code) {
    // This is a placeholder for MFA
    // Implementation would depend on your specific requirements
    console.warn('MFA not implemented in this template');
    return false;
  }

  // MARK: - Helper Methods

  /**
   * Map Firebase user to our User model
   */
  _mapToUser(firebaseUser) {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      isEmailVerified: firebaseUser.emailVerified,
      phoneNumber: firebaseUser.phoneNumber,
      createdAt: new Date(firebaseUser.metadata.creationTime),
      lastLoginAt: firebaseUser.metadata.lastSignInTime 
        ? new Date(firebaseUser.metadata.lastSignInTime)
        : null,
      metadata: {
        providerId: firebaseUser.providerId,
        providers: firebaseUser.providerData.map(p => p.providerId)
      }
    };
  }

  /**
   * Map to AuthResult
   */
  _mapToAuthResult(user, error) {
    if (user) {
      return {
        user: this._mapToUser(user),
        state: AuthState.AUTHENTICATED,
        error: null
      };
    } else {
      return {
        user: null,
        state: AuthState.ERROR,
        error: error ? error.message : 'Unknown authentication error'
      };
    }
  }

  /**
   * Validate password against requirements
   */
  _validatePassword(password) {
    if (password.length < this.config.passwordMinLength) {
      throw new Error(`Password must be at least ${this.config.passwordMinLength} characters long`);
    }
    
    if (this.config.passwordRequireSpecialChars && !/[^A-Za-z0-9]/.test(password)) {
      throw new Error('Password must contain at least one special character');
    }
    
    if (this.config.passwordRequireNumbers && !/[0-9]/.test(password)) {
      throw new Error('Password must contain at least one number');
    }
    
    if (this.config.passwordRequireUppercase && !/[A-Z]/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter');
    }
  }

  /**
   * Clear stored credentials from secure storage
   */
  async _clearStoredCredentials() {
    if (this.config.useSecureStorage) {
      try {
        await AsyncStorage.removeItem('@auth:credentials');
      } catch (error) {
        console.warn('Failed to clear stored credentials:', error);
      }
    }
  }

  // MARK: - Social Sign-In Methods

  /**
   * Sign in with Apple
   */
  async _signInWithApple() {
    // This is a placeholder for Apple Sign In
    // Implementation would depend on your specific requirements
    throw new Error('Apple Sign In not implemented in this template');
  }

  /**
   * Sign in with Google
   */
  async _signInWithGoogle() {
    // This is a placeholder for Google Sign In
    // Implementation would depend on your specific requirements
    throw new Error('Google Sign In not implemented in this template');
  }

  /**
   * Sign in with Facebook
   */
  async _signInWithFacebook() {
    // This is a placeholder for Facebook Sign In
    // Implementation would depend on your specific requirements
    throw new Error('Facebook Sign In not implemented in this template');
  }
}

export default FirebaseAuthService;

export default function ConvertedComponent() {
  return (
    <div className="p-4">
      <h1>Converted JavaScript Component</h1>
      <p>Original code has been preserved above</p>
    </div>
  );
}