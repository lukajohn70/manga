import * as React from 'react';
import Svg, { Path, Rect, Circle, Line, Polyline } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
}

// 1. Home Outline Icon
export const HomeIcon: React.FC<IconProps> = ({ size = 22, color = '#2A2320', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9.5L12 2.5L21 9.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.5Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 21V12H15V21"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Lucide LayoutGrid Icon (Categories)
export const LayoutGridIcon: React.FC<IconProps> = ({ size = 22, color = '#2A2320', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Lucide ShoppingBag Icon (Cart)
export const ShoppingBagIcon: React.FC<IconProps> = ({ size = 22, color = '#2A2320', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 6H21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Lucide Heart Icon (Wishlist)
export const HeartIcon: React.FC<IconProps> = ({ size = 22, color = '#2A2320', strokeWidth = 1.8, fill = 'none' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
    <Path
      d="M19 14C20.49 12.54 22 10.79 22 8.5C22 7.04131 21.4205 5.64236 20.3891 4.61091C19.3576 3.57946 17.9587 3 16.5 3C14.74 3 13.5 3.5 12 5C10.5 3.5 9.26 3 7.5 3C6.04131 3 4.64236 3.57946 3.61091 4.61091C2.57946 5.64236 2 7.04131 2 8.5C2 10.8 3.5 12.55 5 14L12 21L19 14Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={fill}
    />
  </Svg>
);

// Lucide User Icon (Account)
export const UserIcon: React.FC<IconProps> = ({ size = 22, color = '#2A2320', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// 2. Categories Outline Icon (Matching Jumia Reference: square list icon)
export const CategoriesIcon: React.FC<IconProps> = ({ size = 22, color = '#2A2320', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="3"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Line x1="7.5" y1="8" x2="8.5" y2="8" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <Line x1="11.5" y1="8" x2="16.5" y2="8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="7.5" y1="12" x2="8.5" y2="12" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <Line x1="11.5" y1="12" x2="16.5" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="7.5" y1="16" x2="8.5" y2="16" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <Line x1="11.5" y1="16" x2="16.5" y2="16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// 3. Cart Outline Icon
export const CartIcon: React.FC<IconProps> = ({ size = 22, color = '#2A2320', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="9" cy="20" r="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="18" cy="20" r="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M2 3H5L7.2 14.5C7.3 15.1 7.8 15.5 8.4 15.5H18.5C19.1 15.5 19.6 15.1 19.7 14.5L21.5 6.5H6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 4. Wishlist Outline Icon (Heart)
export const WishlistIcon: React.FC<IconProps> = ({ size = 22, color = '#2A2320', strokeWidth = 1.8, fill = 'none' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
    <Path
      d="M20.84 4.61C19.86 3.63 18.42 3.1 16.95 3.1C15.48 3.1 14.04 3.63 13.06 4.61L12 5.67L10.94 4.61C8.91 2.58 5.6 2.58 3.57 4.61C1.54 6.64 1.54 9.95 3.57 11.98L12 20.41L20.43 11.98C22.46 9.95 22.46 6.64 20.43 4.61H20.84Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={fill}
    />
  </Svg>
);

// 5. Account Outline / Active Icon (Matching Jumia Reference: User with check badge when active)
export const AccountIcon: React.FC<IconProps & { active?: boolean }> = ({
  size = 22,
  color = '#2A2320',
  strokeWidth = 1.8,
  active = false,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {active ? (
      <>
        {/* User head */}
        <Circle cx="11" cy="7.5" r="3.8" fill={color} />
        {/* User body */}
        <Path
          d="M3.5 19.5C3.5 16 6.5 13.5 11 13.5C12.8 13.5 14.4 13.9 15.6 14.6C14.6 15.5 14 16.7 14 18.2C14 18.7 14.1 19.1 14.3 19.5H3.5Z"
          fill={color}
        />
        {/* Verification Checkmark Badge on bottom right */}
        <Circle cx="18" cy="18" r="4.5" fill={color} />
        <Path
          d="M16 18L17.5 19.5L20.2 16.5"
          stroke="#FFFFFF"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ) : (
      <>
        <Circle cx="12" cy="7.5" r="3.8" stroke={color} strokeWidth={strokeWidth} />
        <Path
          d="M4.5 19.5C4.5 16.2 7.8 13.8 12 13.8C16.2 13.8 19.5 16.2 19.5 19.5"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </>
    )}
  </Svg>
);

// Chevron Right
export const ChevronRightIcon: React.FC<IconProps> = ({ size = 18, color = '#8C8279', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 5L16 12L9 19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Chevron Down
export const ChevronDownIcon: React.FC<IconProps> = ({ size = 18, color = '#8C8279', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9L12 15L18 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Search Icon
export const SearchIcon: React.FC<IconProps> = ({ size = 18, color = '#8C8279', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={strokeWidth} />
    <Line x1="16.5" y1="16.5" x2="21.5" y2="21.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// Orders Icon (Box / Calendar)
export const OrdersIcon: React.FC<IconProps> = ({ size = 20, color = '#2A2320', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="17" rx="2" stroke={color} strokeWidth={strokeWidth} />
    <Line x1="3" y1="9" x2="21" y2="9" stroke={color} strokeWidth={strokeWidth} />
    <Line x1="8" y1="2" x2="8" y2="5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="16" y1="2" x2="16" y2="5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Rect x="8" y="13" width="8" height="4" rx="1" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

// Inbox / Mail Icon
export const InboxIcon: React.FC<IconProps> = ({ size = 20, color = '#2A2320', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="16" rx="2" stroke={color} strokeWidth={strokeWidth} />
    <Polyline points="3,6 12,13 21,6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Ratings & Reviews Icon (Chat bubble with check/star)
export const ReviewsIcon: React.FC<IconProps> = ({ size = 20, color = '#2A2320', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 15C21 16.1 20.1 17 19 17H7L3 21V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5V15Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line x1="8" y1="8" x2="16" y2="8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="8" y1="12" x2="13" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// Vouchers / Ticket Icon
export const VoucherIcon: React.FC<IconProps> = ({ size = 20, color = '#2A2320', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 9C3.65685 9 5 7.65685 5 6H19C19 7.65685 20.3431 9 22 9V15C20.3431 15 19 16.3431 19 18H5C5 16.3431 3.65685 15 2 15V9Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Line x1="12" y1="8" x2="12" y2="16" stroke={color} strokeWidth={strokeWidth} strokeDasharray="2 2" strokeLinecap="round" />
  </Svg>
);

// Followed Sellers / Storefront Icon
export const StoreIcon: React.FC<IconProps> = ({ size = 20, color = '#2A2320', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9L4 3H20L21 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3 9C3 10.65 4.35 12 6 12C7.65 12 9 10.65 9 9C9 10.65 10.35 12 12 12C13.65 12 15 10.65 15 9C15 10.65 16.35 12 18 12C19.65 12 21 10.65 21 9V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V9Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="9" y1="21" x2="9" y2="15" stroke={color} strokeWidth={strokeWidth} />
    <Line x1="15" y1="21" x2="15" y2="15" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

// Recently Viewed / Eye Icon
export const EyeIcon: React.FC<IconProps> = ({ size = 20, color = '#2A2320', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

// Back to the top Arrow Icon
export const ArrowUpIcon: React.FC<IconProps> = ({ size = 18, color = '#FAF6F0', strokeWidth = 2.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="12" y1="19" x2="12" y2="5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Polyline points="5 12 12 5 19 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Shield / Legal / Privacy Icon
export const ShieldCheckIcon: React.FC<IconProps> = ({ size = 20, color = '#2A2320', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22S4 18 4 12V5L12 2L20 5V12C20 18 12 22 12 22Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Polyline points="9 12 11 14 15 10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Document / Terms Icon
export const DocumentTextIcon: React.FC<IconProps> = ({ size = 20, color = '#2A2320', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Polyline points="14 2 14 8 20 8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="8" y1="13" x2="16" y2="13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="8" y1="17" x2="14" y2="17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// Trash / Remove Icon
export const TrashIcon: React.FC<IconProps> = ({ size = 18, color = '#B5532E', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polyline points="3 6 5 6 21 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6M8 6V4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Close / X Icon
export const CloseIcon: React.FC<IconProps> = ({ size = 20, color = '#2A2320', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Back Arrow (Left)
export const ArrowLeftIcon: React.FC<IconProps> = ({ size = 20, color = '#2A2320', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="19" y1="12" x2="5" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Polyline points="12 19 5 12 12 5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Location Pin
export const LocationPinIcon: React.FC<IconProps> = ({ size = 20, color = '#2A2320', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 10C21 17 12 23 12 23C12 23 3 10 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

// Notification Bell
export const BellIcon: React.FC<IconProps> = ({ size = 20, color = '#2A2320', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M13.73 21A2 2 0 0 1 10.27 21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Lock
export const LockIcon: React.FC<IconProps> = ({ size = 20, color = '#2A2320', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="11" width="18" height="11" rx="2" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Check Mark
export const CheckIcon: React.FC<IconProps> = ({ size = 18, color = '#4F6B3A', strokeWidth = 2.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polyline points="20 6 9 17 4 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Copy Icon
export const CopyIcon: React.FC<IconProps> = ({ size = 16, color = '#8C8279', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="9" y="9" width="13" height="13" rx="2" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

// Star
export const StarIcon: React.FC<IconProps> = ({ size = 16, color = '#D9A441', fill = '#D9A441' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke={color} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Phone Icon
export const PhoneIcon: React.FC<IconProps> = ({ size = 18, color = '#2A2320', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
