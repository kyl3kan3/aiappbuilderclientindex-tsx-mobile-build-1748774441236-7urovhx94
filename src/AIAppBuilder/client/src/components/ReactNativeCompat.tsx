import React from 'react';

// React Native compatibility layer for web preview
export const StyleSheet = {
  create: (styles: any) => styles,
};

export const View = ({ style, children, ...props }: any) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export const Text = ({ style, children, ...props }: any) => (
  <span
    style={{
      fontFamily: 'Inter, system-ui, sans-serif',
      ...style,
    }}
    {...props}
  >
    {children}
  </span>
);

export const TouchableOpacity = ({ style, onPress, children, ...props }: any) => (
  <button
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: 'pointer',
      outline: 'none',
      ...style,
    }}
    onClick={onPress}
    {...props}
  >
    {children}
  </button>
);

export const ScrollView = ({ style, children, ...props }: any) => (
  <div
    style={{
      overflow: 'auto',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export const SafeAreaView = ({ style, children, ...props }: any) => (
  <div
    style={{
      padding: '20px',
      minHeight: '100vh',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export const Image = ({ style, source, ...props }: any) => (
  <img
    style={style}
    src={source?.uri || source}
    {...props}
  />
);

export const TextInput = ({ style, value, onChangeText, placeholder, ...props }: any) => (
  <input
    style={{
      padding: '8px 12px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '16px',
      ...style,
    }}
    value={value}
    onChange={(e) => onChangeText?.(e.target.value)}
    placeholder={placeholder}
    {...props}
  />
);

export const FlatList = ({ data, renderItem, style, ...props }: any) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}
    {...props}
  >
    {data?.map((item: any, index: number) => (
      <div key={index}>
        {renderItem({ item, index })}
      </div>
    ))}
  </div>
);

// Export all components for easy import
export const ReactNative = {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
  FlatList,
};