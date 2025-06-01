import React from 'react';

// Converted from JavaScript
import React, {useContext} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import {ThemeContext} from '../context/ThemeContext';

/**
 * Custom Button Component
 *
 * A flexible, customizable button implementation for React Native that supports
 * different styles, states, and sizes.
 *
 * @param {object} props - Component props
 * @param {string} props.title - Button text
 * @param {function} props.onPress - Button press handler
 * @param {string} props.buttonStyle - Button style ('primary', 'secondary', 'success', etc.)
 * @param {string} props.buttonSize - Button size ('small', 'medium', 'large', 'extraLarge')
 * @param {string} props.buttonShape - Button shape ('rectangle', 'rounded', 'pill', 'circle')
 * @param {boolean} props.isLoading - Whether the button is in loading state
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {object} props.startIcon - Icon component to show at the start of the button
 * @param {object} props.endIcon - Icon component to show at the end of the button
 * @param {object} props.style - Additional styles for the button
 * @param {object} props.textStyle - Additional styles for the button text
 */
const Button = ({
  title,
  onPress,
  buttonStyle = 'primary',
  buttonSize = 'medium',
  buttonShape = 'rounded',
  isLoading = false,
  disabled = false,
  startIcon,
  endIcon,
  style,
  textStyle,
  ...props
}) => {
  // Get theme from context
  const theme = useContext(ThemeContext);
  const isDisabled = disabled || isLoading;

  // Generate dynamic styles based on props
  const buttonStyles = getButtonStyles(theme, buttonStyle, buttonSize, buttonShape, isDisabled);
  const textStyles = getTextStyles(theme, buttonStyle, buttonSize, isDisabled);

  // Render button
  return (
    <button
      className="mobile-converted"
      onClick={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}>
      <div className="mobile-converted">
        {/* Start Icon */}
        {startIcon && !isLoading && (
          <div className="mobile-converted">
            {React.cloneElement(startIcon, {
              style: [
                {
                  marginRight: 8,
                  color: textStyles.text.color,
                },
                startIcon.props.style,
              ],
            })}
          </div>
        )}

        {/* Loading Indicator or Text */}
        {isLoading ? (
          <ActivityIndicator
            color={textStyles.text.color}
            size={getActivityIndicatorSize(buttonSize)}
          />
        ) : (
          <span className="mobile-converted">{title}</span>
        )}

        {/* End Icon */}
        {endIcon && !isLoading && (
          <div className="mobile-converted">
            {React.cloneElement(endIcon, {
              style: [
                {
                  marginLeft: 8,
                  color: textStyles.text.color,
                },
                endIcon.props.style,
              ],
            })}
          </div>
        )}
      </div>
    </button>
  );
};

/**
 * Get button container styles based on props
 */
const getButtonStyles = (theme, buttonStyle, buttonSize, buttonShape, isDisabled) => {
  // Base styles
  const styles = {
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
  };

  // Apply button style
  switch (buttonStyle) {
    case 'primary':
      "mobile-converted".backgroundColor = theme.colors.primary;
      break;
    case 'secondary':
      "mobile-converted".backgroundColor = theme.colors.secondary;
      break;
    case 'success':
      "mobile-converted".backgroundColor = theme.colors.success;
      break;
    case 'danger':
      "mobile-converted".backgroundColor = theme.colors.danger;
      break;
    case 'warning':
      "mobile-converted".backgroundColor = theme.colors.warning;
      break;
    case 'info':
      "mobile-converted".backgroundColor = theme.colors.info;
      break;
    case 'light':
      "mobile-converted".backgroundColor = theme.colors.light;
      break;
    case 'dark':
      "mobile-converted".backgroundColor = theme.colors.dark;
      break;
    case 'outlined':
      "mobile-converted".backgroundColor = 'transparent';
      "mobile-converted".borderWidth = 1;
      "mobile-converted".borderColor = theme.colors.primary;
      break;
    case 'text':
      "mobile-converted".backgroundColor = 'transparent';
      break;
    case 'link':
      "mobile-converted".backgroundColor = 'transparent';
      break;
    default:
      "mobile-converted".backgroundColor = theme.colors.primary;
  }

  // Apply button size
  switch (buttonSize) {
    case 'small':
      "mobile-converted".paddingVertical = 6;
      "mobile-converted".paddingHorizontal = 12;
      "mobile-converted".minHeight = 32;
      break;
    case 'medium':
      "mobile-converted".paddingVertical = 10;
      "mobile-converted".paddingHorizontal = 20;
      "mobile-converted".minHeight = 40;
      break;
    case 'large':
      "mobile-converted".paddingVertical = 14;
      "mobile-converted".paddingHorizontal = 28;
      "mobile-converted".minHeight = 48;
      break;
    case 'extraLarge':
      "mobile-converted".paddingVertical = 18;
      "mobile-converted".paddingHorizontal = 36;
      "mobile-converted".minHeight = 56;
      break;
    default:
      "mobile-converted".paddingVertical = 10;
      "mobile-converted".paddingHorizontal = 20;
      "mobile-converted".minHeight = 40;
  }

  // Apply button shape
  switch (buttonShape) {
    case 'rectangle':
      "mobile-converted".borderRadius = 0;
      break;
    case 'rounded':
      "mobile-converted".borderRadius = theme.shape.borderRadius.medium;
      break;
    case 'pill':
      "mobile-converted".borderRadius = 999;
      break;
    case 'circle':
      "mobile-converted".borderRadius = 999;
      const size = buttonSize === 'small' ? 32 : buttonSize === 'medium' ? 40 : buttonSize === 'large' ? 48 : 56;
      "mobile-converted".width = size;
      "mobile-converted".height = size;
      "mobile-converted".paddingHorizontal = 0;
      break;
    default:
      "mobile-converted".borderRadius = theme.shape.borderRadius.medium;
  }

  // Apply disabled state
  if (isDisabled) {
    "mobile-converted".opacity = 0.5;
  }

  // Apply shadow for solid buttons (not outlined, text, or link)
  if (
    buttonStyle !== 'outlined' &&
    buttonStyle !== 'text' &&
    buttonStyle !== 'link'
  ) {
    "mobile-converted".shadowColor = '#000';
    "mobile-converted".shadowOffset = {width: 0, height: 2};
    "mobile-converted".shadowOpacity = 0.1;
    "mobile-converted".shadowRadius = 3;
    "mobile-converted".elevation = 2;
  }

  return styles;
};

/**
 * Get text styles based on props
 */
const getTextStyles = (theme, buttonStyle, buttonSize, isDisabled) => {
  // Base styles
  const styles = {
    text: {
      fontWeight: '500',
      textAlign: 'center',
      color: theme.colors.onPrimary,
    },
  };

  // Apply text color based on button style
  switch (buttonStyle) {
    case 'primary':
      "mobile-converted".color = theme.colors.onPrimary;
      break;
    case 'secondary':
      "mobile-converted".color = theme.colors.onSecondary;
      break;
    case 'success':
      "mobile-converted".color = theme.colors.onSuccess;
      break;
    case 'danger':
      "mobile-converted".color = theme.colors.onDanger;
      break;
    case 'warning':
      "mobile-converted".color = theme.colors.onWarning;
      break;
    case 'info':
      "mobile-converted".color = theme.colors.onInfo;
      break;
    case 'light':
      "mobile-converted".color = theme.colors.onLight;
      break;
    case 'dark':
      "mobile-converted".color = theme.colors.onDark;
      break;
    case 'outlined':
    case 'text':
    case 'link':
      "mobile-converted".color = theme.colors.primary;
      break;
    default:
      "mobile-converted".color = theme.colors.onPrimary;
  }

  // Apply text size based on button size
  switch (buttonSize) {
    case 'small':
      "mobile-converted".fontSize = 14;
      break;
    case 'medium':
      "mobile-converted".fontSize = 16;
      break;
    case 'large':
      "mobile-converted".fontSize = 18;
      break;
    case 'extraLarge':
      "mobile-converted".fontSize = 20;
      break;
    default:
      "mobile-converted".fontSize = 16;
  }

  // Apply text decoration for link style
  if (buttonStyle === 'link') {
    "mobile-converted".textDecorationLine = 'underline';
  }

  return styles;
};

/**
 * Get activity indicator size based on button size
 */
const getActivityIndicatorSize = (buttonSize) => {
  switch (buttonSize) {
    case 'small':
      return 'small';
    case 'medium':
    case 'large':
    case 'extraLarge':
      return 'small';
    default:
      return 'small';
  }
};

export default Button;

export default function ConvertedComponent() {
  return (
    <div className="p-4">
      <h1>Converted JavaScript Component</h1>
      <p>Original code has been preserved above</p>
    </div>
  );
}