import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface User {
  user_id: number;
  user_name: string;
}

export interface Company {
  comp_id: number;
  comp_name: string;
}

export interface FinancialYear {
  fin_year_id: number;
  fin_name: string; 
}

export interface CountryDropdown {
  country_id: number;
  country_name: string; 
}

export interface StateDropdown {
  state_id: number;
  state_name: string;
}

export interface CityDropdown {
  city_id: number;
  city_name: string; 
}

export interface StateRow {
  state_id: number;
  state_name: string;
  country_id?: number;
  country_name?: string;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  updated_date?: string;
}


export interface CityRow {
  city_id: number;
  city_name: string;
  state_id?: number;
  state_name?: string;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  updated_date?: string;
}


export interface SingleUserDetails {
  user_details_id: number;
  user_id: number;
  comp_id: number;
  fin_year_id: number;
  is_active: boolean;
  created_date: string;
  updated_date: string | null;
  modified_by: number;
}

export interface CompanyList {
  comp_id: number;
  comp_code: string;
  comp_name: string;
  comp_short_name: string;
  comp_type: string;
  comp_desc: string;
  cin_number: string;
  gst_number: string;
  pan_number: string;
  contperson_name: string;
  contact_email: string;
  contact_phone: string;
  address_line1: string;
  address_line2: string;
  city_id: number;
  city_name: string;
  pincode: string;
  is_active: boolean;
  created_date: string;
  updated_date: string;
  logo_path: string;
  created_by: number;
  modified_by?: number;
  created_by_name: string;
  modified_by_name?: string;
}

export interface SingleCompany {
  comp_id: number;
  comp_code: string;
  comp_name: string;
  comp_short_name: string;
  comp_type: string;
  comp_desc: string;
  cin_number: string;
  gst_number: string;
  pan_number: string;
  contperson_name: string;
  contact_email: string;
  contact_phone: string;
  address_line1: string;
  address_line2: string;
  city_id: number;
  city_name:string;
  pincode: string;
  is_active: boolean;
  created_date?: Date;
  updated_date?: Date;
  logo_path: string;
  created_by: number;
  modified_by?: number;
}

export interface FinYearList {
  fin_year_id: number;
  fin_name: string;
  short_fin_year: string;
  year_start: string;
  year_end: string;
  created_date: string;
  updated_date: string;
  created_by: number;
  modified_by: number;
  created_by_name: string;
  modified_by_name: string;
}

export interface SingleFinYear {
  fin_year_id: number;
  fin_name: string;
  short_fin_year: string;
  year_start: Date;
  year_end: Date;
  created_date: Date;
  updated_date: Date | null;
  created_by: number;
  modified_by: number;
}

export interface BrandList {
  brand_id: number;
  brand_name: string;
  brand_desc: string;
  created_date: string;
  updated_date: string;
  created_by: number;
  modified_by: number;
  created_by_name: string;
  modified_by_name: string;
}

export interface SingleBrand {
  brand_id: number;
  brand_name: string;
  brand_desc: string;
  created_date: string | null;
  updated_date: string | null;
  created_by: number;
  modified_by: number | null;
}

export interface DropBrand {
  brand_id: number;
  brand_name: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginServices {

  
 private baseUrl = 'https://localhost:7046/api';

  constructor(private http: HttpClient) {}

   getUsers(): Observable<User[]> {
    return this.http.get<any[]>(`${this.baseUrl}/User/dropdown_user_list`).pipe(
      map(data =>
        data.map(item => ({
          user_id: item.user_id,
          user_name: item.user_name
        }))
      )
    );
  }

  // getCompanies(): Observable<Company[]> {
  //   return this.http.get<any[]>(`${this.baseUrl}/Company/dropdown_company_list`).pipe(
  //     map(data =>
  //       data.map(item => ({
  //         comp_id: item.comp_id,
  //         comp_name: item.comp_name
  //       }))
  //     )
  //   );
  // }

  getCompanies(userId: number): Observable<Company[]> {
  return this.http.get<any[]>(
    `${this.baseUrl}/Company/dropdown_company_list?userId=${userId}`
  ).pipe(
    map(data =>
      data.map(item => ({
        comp_id: item.comp_id,
        comp_name: item.comp_name
      }))
    )
  );
}



  //   getFinYears(): Observable<FinancialYear[]> {
  //   return this.http.get<any[]>(`${this.baseUrl}/FinYear/dropdown_finyear_list`).pipe(
  //     map(data =>
  //       data.map(item => ({
  //         fin_year_id: item.fin_year_id,
  //         fin_name: item.fin_name
  //       }))
  //     )
  //   );
  // }


  firstLoginValidate(payload: any): Observable<any> {
      return this.http.post(`${this.baseUrl}/Auth/validatelogin`, payload);
  }

  saveLogin(payload: any): Observable<any> {
      return this.http.post(`${this.baseUrl}/Auth/savelogin`, payload);
  }

  registerUser(payload: any): Observable<any> {
      return this.http.post(`${this.baseUrl}/Auth/Register`, payload);
  }

    
  updateUser(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/User/update_user`, payload);
  }

  
  getUserById(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/User/user/${userId}`);
  }


 getUserDetailsList() {
  return this.http.get<any[]>(`${this.baseUrl}/Home/userdetails_list`);
}


 addUpdatedUserDetails(payload: any) {
  return this.http.post(`${this.baseUrl}/User/insert_userdetails`, payload);
}

 addUserDetails(payload: any) {
  return this.http.post(`${this.baseUrl}/User/insert_multipleuserdetails`, payload);
}

 getUserDetailsById(id: number) {
  return this.http.get<SingleUserDetails>(`${this.baseUrl}/User/userdetails/${id}`);
}


 updateUserDetails(payload: any) {
  return this.http.post(`${this.baseUrl}/User/update_userdetails`, payload);
}


  getMultipleUserDetails(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/User/multiple_userdetails/${userId}`);
  }

    DeleteUserDetails(userId: number): Observable<any[]> {
    return this.http.delete<any[]>(`${this.baseUrl}/User/delete_userdetails/${userId}`);
  }

  

  getCountryList(): Observable<any> {
     return this.http.get<any[]>(`${this.baseUrl}/Country/country_list`);
  }

  insertCountry(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Country/Addcountry`, payload);
  }

  updateCountry(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Country/UpdateCountry`, payload);
  }

  deleteCountry(id: number): Observable<any> {
    return this.http.delete<any[]>(`${this.baseUrl}/Country/DeleteCountry/${id}`);
  }


  getCountries(): Observable<CountryDropdown[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Country/dropdown_country_list`).pipe(
      map(data => (data || []).map((item: any) => ({
        country_id: item.country_id,
        country_name: item.country_name
      })))
    );
  }



  

  // getStateList(): Observable<any> {
  //    return this.http.get<any[]>(`${this.baseUrl}/State/state_list`);
  // }


   getStateList(): Observable<StateRow[]> {
    return this.http.get<any[]>(`${this.baseUrl}/State/state_list`).pipe(
      map(data => (data || []).map((item: any) => ({
        state_id: item.state_id,
        state_name: item.state_name,
        country_id: item.country_id,
        country_name: item.country_name,
        created_by: item.created_by,
        created_date: item.created_date,
        modified_by: item.modified_by,
        updated_date: item.updated_date
      })))
    );
  }

  insertState(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/State/insert_state`, payload);
  }

  updateState(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/State/UpdateState`, payload);
  }

  deleteState(id: number): Observable<any> {
    return this.http.delete<any[]>(`${this.baseUrl}/State/DeleteState/${id}`);
  }

  getStates(countryId: number = 0): Observable<StateDropdown[]> {
    return this.http.get<any[]>(`${this.baseUrl}/State/dropdown_state_list?country_id=${countryId}`)
      .pipe(
        map(data => (data || []).map((item: any) => ({
          state_id: item.state_id,
          state_name: item.state_name
        })))
      );
  }


  // entire city list for grid
  getCityList(): Observable<CityRow[]> {
    return this.http.get<any[]>(`${this.baseUrl}/City/city_list`)
      .pipe(
        map(data => (data || []).map((item: any) => ({
          city_id: item.city_id,
          city_name: item.city_name,
          state_id: item.state_id,
          state_name: item.state_name,
          created_by: item.created_by,
          created_date: item.created_date,
          modified_by: item.modified_by,
          updated_date: item.updated_date
        })))
      );
  }

  insertCity(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/City/insert_city`, payload);
  }

  updateCity(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/City/UpdateCity`, payload);
  }

  deleteCity(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/City/DeleteCity/${id}`);
  }

  // getCitys(stateId: number): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.baseUrl}/City/dropdown_city_list?id=${stateId}`);
  // }

    getCitys(stateId: number): Observable<CityDropdown[]> {
    return this.http.get<any[]>(`${this.baseUrl}/City/dropdown_city_list?id=${stateId}`)
      .pipe(
        map(data => (data || []).map((item: any) => ({
          city_id: item.city_id,
          city_name: item.city_name
        })))
      );
  }


  //api company

  getCompanyList(): Observable<CompanyList[]> {
    return this.http.get<CompanyList[]>(`${this.baseUrl}/Company/company_list`);
  }


  getCompanyById(id: number): Observable<SingleCompany> {
  return this.http.get<SingleCompany>(`${this.baseUrl}/Company/company/${id}`);
  }

  insertCompany(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Company/InsertCompany`,payload);
  }

  updateCompany(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Company/Updatecompany`,payload);
  }

  deleteCompany(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Company/Deletecompany/${id}`);
  }


  //apifinyear

  insertFinYear(payload: any): Observable<any> 
    {return this.http.post(`${this.baseUrl}/FinYear/insert_fin_year`,payload);
  }

  updateFinYear(payload: any): Observable<any>  {
    return this.http.post(`${this.baseUrl}/FinYear/UpdateFinYear`,payload);
  }

  deleteFinYear(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/FinYear/DeleteFinYear/${id}`);
  }

  getFinYearList(): Observable<FinYearList[]> {
    return this.http.get<FinYearList[]>(`${this.baseUrl}/FinYear/fin_year_list`);
  }

  getFinYearById(finYearId: number): Observable<SingleFinYear> {
    return this.http.get<SingleFinYear>(`${this.baseUrl}/FinYear/fin_year/${finYearId}`);
  }

  getFinYears(userId: number): Observable<FinancialYear[]> {
  return this.http.get<any[]>(
    `${this.baseUrl}/FinYear/dropdown_finyear_list?userId=${userId}`
  ).pipe(
    map(data =>
      data.map(item => ({
        fin_year_id: item.fin_year_id,
        fin_name: item.fin_name
      }))
    )
  );
}


//brandapi

 insertBrand(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Brand/insert_brand`,payload);
  }

  updateBrand(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Brand/update_brand`,payload);
  }

  deleteBrand(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Brand/delete_brand/${id}`);
  }

  getBrandList(): Observable<BrandList[]> {
    return this.http.get<BrandList[]>(`${this.baseUrl}/Brand/brand_list`);
  }

  getBrandById(brandId: number): Observable<SingleBrand> {
    return this.http.get<SingleBrand>(`${this.baseUrl}/Brand/brand/${brandId}`);
  }


  getBrands(): Observable<DropBrand[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/Brand/dropdown_brand_list`
    ).pipe(
      map(data =>
        data.map(item => ({
          brand_id: item.brand_id,
          brand_name: item.brand_name
        }))
      )
    );
  }





  
}
