import { format } from "date-fns";

/**
 * Formats a date string or Date object to DD/MM/YYYY format
 */
export function formatDate(date: Date | string | undefined): string {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Formats a date string or Date object with time (DD/MM/YYYY HH:mm)
 */
export function formatDateWithTime(date: Date | string | undefined): string {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd/MM/yyyy HH:mm');
  } catch (error) {
    console.error('Error formatting date with time:', error);
    return 'Invalid date';
  }
}

/**
 * Formats a date string in ISO format to a WHOIS-style date format
 * Example: 2024-12-21T01:26:49Z -> 2024-12-21T01:26:49Z
 */
export function formatWhoisDate(date: string | undefined): string {
  if (!date) return 'N/A';
  
  try {
    // For WHOIS dates, we'll keep the original format if it's already in the right format
    if (date.includes('T') && date.includes('Z')) {
      return date;
    }
    
    // Otherwise format it to the standard WHOIS date format
    const dateObj = new Date(date);
    return format(dateObj, "yyyy-MM-dd'T'HH:mm:ss'Z'");
  } catch (error) {
    console.error('Error formatting WHOIS date:', error);
    return date; // Return the original if there's an error
  }
}
