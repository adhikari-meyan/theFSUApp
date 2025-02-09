export const nepaliMonths = [
    'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 
    'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 
    'Poush', 'Magh', 'Falgun', 'Chaitra'
  ];
  
  export const nepaliMonthsNp = [
    'बैशाख', 'जेठ', 'असार', 'श्रावण',
    'भदौ', 'असोज', 'कार्तिक', 'मंसिर',
    'पुष', 'माघ', 'फाल्गुन', 'चैत्र'
  ];
  
  export const nepaliMonthDays = {
    2080: [31, 31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30],
    2081: [31, 31, 32, 31, 31, 31, 30, 29, 30, 30, 29, 31],
    2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 30, 29, 31]
  };
  
  export class NepaliDate {
    constructor(year, month, day) {
      this.year = year;
      this.month = month;
      this.day = day;
    }
  
    static now() {
      // This is a simplified conversion - in production, use a proper conversion library
      const today = new Date();
      // Adding approximate offset for 2080 BS (2023/2024 AD)
      return new NepaliDate(2080, today.getMonth(), today.getDate());
    }
  
    static fromAD(date) {
      // Simplified conversion - in production use a proper conversion library
      const offset = 56.7; // Approximate years to add for BS
      const year = Math.floor(date.getFullYear() + offset);
      return new NepaliDate(year, date.getMonth(), date.getDate());
    }
  
    getMonthDays() {
      return nepaliMonthDays[this.year]?.[this.month] || 30;
    }
  
    format() {
      return `${this.year} ${nepaliMonths[this.month]} ${this.day}`;
    }
  
    formatNp() {
      return `${this.year} ${nepaliMonthsNp[this.month]} ${this.day}`;
    }
  
    static getMonthName(month) {
      return nepaliMonths[month];
    }
  
    static getMonthNameNp(month) {
      return nepaliMonthsNp[month];
    }
  }
  