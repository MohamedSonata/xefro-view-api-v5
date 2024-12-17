type DateTimeInfo = {
    utc_offset: string;
    timezone: string;
    day_of_week: number;
    day_of_year: number;
    datetime: string;
    utc_datetime: string;
    unixtime: number;
    raw_offset: number;
    week_number: number;
    dst: boolean;
    abbreviation: string;
    dst_offset: number;
    dst_from: string | null;
    dst_until: string | null;
    client_ip: string;
  };
  
 export async function getDateTimeInfo(timezone: string, clientIp: string): Promise<DateTimeInfo> {
    const now = new Date();
  
    // Get the date in the specific timezone
    const options: Intl.DateTimeFormatOptions = { 
      timeZone: timezone, 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: false 
    };
  
    // Get the current time in the specified timezone
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(now);
  
    // Extract parts like year, month, day, hour, minute, and second
    const getPart = (type: string) => parts.find((part) => part.type === type)?.value || '00';
  
    const year = getPart('year');
    const month = getPart('month');
    const day = getPart('day');
    const hour = getPart('hour');
    const minute = getPart('minute');
    const second = getPart('second');
  
    // Convert the formatted date back to a valid ISO string for the given timezone
   const localDateTime = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  const localDate = new Date(`${localDateTime}`).toISOString();
  
    // Calculate UTC offset
    const timezoneOffsetMinutes = new Date().getTimezoneOffset() * -1; // Minutes (negative for west of UTC)
    const localOffsetMinutes = getTimezoneOffsetMinutes(timezone); // Get offset for specified timezone
    const rawOffset = localOffsetMinutes * 60; // Convert minutes to seconds
    const utcOffset = formatUtcOffset(localOffsetMinutes); // Convert offset to "+03:00" format
  
    // Create the datetime with UTC offset
    const datetimeWithOffset = `${localDateTime}${utcOffset}`;
  
    // Calculate UNIX time (seconds since 1970)
    const unixtime = Math.floor(new Date().getTime() / 1000);
  
    // Calculate day of the week (0=Sunday, 1=Monday, etc.)
    const day_of_week = new Date().getDay();
  
    // Calculate the day of the year
    const day_of_year = Math.floor((new Date().getTime() - new Date(`${new Date().getFullYear()}-01-01T00:00:00Z`).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
    // Calculate week number
    const week_number = getWeekNumber(new Date());
  
    // Determine DST information
    const dst = isDstActive(timezone);
    const dst_offset = dst ? 3600 : 0; // If DST is active, usually 1 hour = 3600 seconds
    const abbreviation = getTimezoneAbbreviation(timezone);
  
    return {
      utc_offset: utcOffset,
      timezone: timezone,
      day_of_week: day_of_week,
      day_of_year: day_of_year,
      datetime: datetimeWithOffset,
      utc_datetime: now.toISOString(),
      unixtime: unixtime,
      raw_offset: rawOffset,
      week_number: week_number,
      dst: dst,
      abbreviation: abbreviation,
      dst_offset: dst_offset,
      dst_from: null, // Dynamic DST period can be added if required
      dst_until: null, // Dynamic DST period can be added if required
      client_ip: clientIp
    };
  }
  
  /**
   * Get the offset for a specific timezone in minutes
   */
  function getTimezoneOffsetMinutes(timezone: string): number {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: timezone });
    const parts = formatter.formatToParts(now);
    const utcDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds()));
    const localDate = new Date(utcDate.toLocaleString('en-US', { timeZone: timezone }));
    return (localDate.getTime() - utcDate.getTime()) / (1000 * 60);
  }
  
  /**
   * Format a UTC offset (in minutes) as "+03:00"
   */
  function formatUtcOffset(offsetMinutes: number): string {
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const absoluteMinutes = Math.abs(offsetMinutes);
    const hours = Math.floor(absoluteMinutes / 60).toString().padStart(2, '0');
    const minutes = (absoluteMinutes % 60).toString().padStart(2, '0');
    return `${sign}${hours}:${minutes}`;
  }
  
  /**
   * Check if Daylight Saving Time (DST) is active for a given timezone
   */
  function isDstActive(timezone: string): boolean {
    const january = new Date(Date.UTC(new Date().getFullYear(), 0, 1));
    const july = new Date(Date.UTC(new Date().getFullYear(), 6, 1));
    const offsetJan = january.getTimezoneOffset();
    const offsetJul = july.getTimezoneOffset();
    return offsetJan !== offsetJul;
  }
  
  /**
   * Get the week number of the year for a given date
   */
  function getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7; // Monday = 1, Sunday = 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24) + 1) / 7);
  }
  
  /**
   * Get timezone abbreviation for a given timezone
   */
  function getTimezoneAbbreviation(timezone: string): string {
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'short' });
    const parts = formatter.formatToParts(new Date());
    return parts.find(part => part.type === 'timeZoneName')?.value || 'N/A';
  }
  
  export default getDateTimeInfo;
//   const timezone = 'Asia/Amman';
//   const clientIp = '176.29.59.60';
  
//   const dateTimeInfo = getDateTimeInfo(timezone, clientIp);
//   console.log(dateTimeInfo);
  