export interface tableChart{
    _id:string,
    count:number
}

export interface chartPayload {
    orders:tableChart[],
    services:tableChart[]
}


export interface MetricsApiResponse {
  dateRange: {
    start: string;
    end: string;
  };
  productIncome:number;
  serviceIncome:number;

  
}
