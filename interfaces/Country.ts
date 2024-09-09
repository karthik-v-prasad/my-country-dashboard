export interface Country {
    name: {
      common: string;
    };
    population: number;
    region: string;
    capital: string[];
    flags: {
      png: string;
    };
    currencies: {
      [key: string]: {
        name: string;
        symbol: string;
      };
    };
    languages: {
      [key: string]: string;
    };
    timezones: string[];
  }
  