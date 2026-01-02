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

export interface ColourList {
  colourId: number;
  colourName: string;
  isActive: boolean;
  created_date: string;
  updated_date: string;
  created_by: number;
  modified_by: number;
  created_by_name: string;
  modified_by_name: string;
}

export interface SingleColour {
  colourId: number;
  colourName: string;
  isActive: boolean;
  created_date: string;
  updated_date: string | null;
  created_by: number;
  modified_by: number;
}

export interface DropColour {
  colourId: number;
  colourName: string;
}


export interface HsnList {
  hsnId: number;
  hsnCode: string;
  cgst_perc: number;
  sgst_perc: number;
  igst_perc: number;
  created_date: string;
  updated_date: string;
  created_by: number;
  modified_by: number | null;
  created_by_name: string;
  modified_by_name: string | null;
}

export interface SingleHsn {
  hsnId: number;
  hsnCode: string;
  cgst_perc: number;
  sgst_perc: number;
  igst_perc: number;
  created_date: string | null;
  updated_date: string | null;
  created_by: number;
  modified_by: number | null;
}

export interface DropHsn {
  hsnId: number;
  hsnCode: string;
}

export interface MonthList {
  month_id: number;
  month_name: string;
  start_date: string;
  end_date: string;
  created_date: string;
  updated_date: string;
  created_by: number;
  modified_by: number;
  created_by_name: string;
  modified_by_name: string;
}

export interface SingleMonth {
  month_id: number;
  month_name: string;
  start_date?: Date;
  end_date?: Date;
  created_date?: Date;
  updated_date?: Date;
  created_by: number;
  modified_by: number;
}

export interface DropMonth {
  month_id: number;
  month_name: string;
}

export interface UnitList {
  unitId: number;
  unitName: string;
  unitDesc: string;
  isActive: boolean;
  created_date: string;
  updated_date: string;
  created_by: number;
  modified_by: number;
  created_by_name: string;
  modified_by_name: string;
}

export interface SingleUnit {
  unitId: number;
  unitName: string;
  unitDesc: string;
  isActive: boolean;
  created_date: string;
  updated_date: string;
  created_by: number;
  modified_by: number;
}

export interface DropUnit {
  unitId: number;
  unitName: string;
}


export interface PaytypeList {
  paytype_Id: number;
  paytype_Name: string;
  paytype_Desc: string;
  created_date: string;
  updated_date: string;
  created_by: number;
  modified_by: number;
  created_by_name: string;
  modified_by_name: string;
}

export interface SinglePaytype {
  paytype_Id: number;
  paytype_Name: string;
  paytype_Desc: string;
  created_date: Date | null;
  updated_date: Date | null;
  created_by: number;
  modified_by: number | null;
}

export interface DropPaytype {
  paytypeId: number;
  paytypeName: string;
}


export interface TransTypeList {
  trans_id: number;
  transtype_name: string;
  transtype_desc: string;
  created_date: string;
  updated_date: string;
  created_by: number;
  modified_by: number;
  created_by_name: string;
  modified_by_name: string;
}

export interface SingleTransType {
  trans_id: number;
  transtype_name: string;
  transtype_desc: string;
  created_Date: Date | null;
  updated_Date: Date | null;
  created_by: number;
  modified_by: number | null;
}

export interface DropTransType {
  trans_id: number;
  transtype_name: string;
}


export interface ProdtypeList {
  prodtype_Id: number;
  prodtype_Name: string;
  prodtype_Desc: string;
  created_date: string;
  updated_date: string;
  created_by: number;
  modified_by: number;
  created_by_name: string;
  modified_by_name: string;
}

export interface SingleProdtype {
  prodtype_Id: number;
  prodtype_Name: string;
  prodtype_Desc: string;
  created_date: Date | null;
  updated_date: Date | null;
  created_by: number;
  modified_by: number;
}

export interface DropProdtype {
  prodtype_Id: number;
  prodtype_Name: string;
}

export interface ProductList {
  product_Id: number;
  prodtype_Id: number;
  prodtype_name: string;
  brand_Id: number;
  brand_name: string;
  hsn_Id: number;
  hsn_name: string;
  unit_Id: number;
  unit_name: string;
  product_name: string;
  product_desc: string;
  rate: number;
  created_Date: string;
  updated_Date: string;
  created_by: number;
  modified_by: number | null;
  created_by_name: string;
  modified_by_name: string | null;
}


export interface SingleProduct {
  product_Id: number;
  prodtype_id: number;
  brand_id: number;
  hsn_id: number;
  unit_id: number;
  product_name: string;
  product_desc: string;
  rate: number;
  created_Date: string | null;
  updated_Date: string | null;
  created_by: number;
  modified_by: number | null;
}


export interface DropProduct {
  product_Id: number;
  product_name: string;
}

export interface ProductDetail_List {
  Product_detail_id: number;
  Product_Id: number;
  Product_name: string;
  Opening_stock: number;
  Purchase: number;
  Sales: number;
  Return: number;
  Current_stock: number;
  reorder_threshold: number;
  reorder_desc: string;
  Created_date: string;
  Updated_date: string;
  Fin_year_id: number;
  Fin_year_name: string;
  Comp_id: number;
  Comp_name: string;
  Created_by: number;
  Modified_by: number | null;
  Created_by_name: string;
  Modified_by_name: string | null;
}


export interface Single_ProductDetail {
  Product_detail_id: number;
  Product_Id: number;
  Opening_stock: number;
  Purchase: number;
  Sales: number;
  Return: number;
  Current_stock: number;
  reorder_threshold: number;
  reorder_desc: string;
  Created_date: Date | null;
  Updated_date: Date | null;
  Fin_year_id: number;
  Fin_year_name: string;
  Comp_id: number;
  Created_by: number;
  Modified_by: number;
}


export interface Drop_ProductDetail {
  Product_detail_id: number;
  Product_Id: number;
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
          brand_id: item.brand_Id,
          brand_name: item.brand_Name
        }))
      )
    );
  }


  ///colour api

  insertColour(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Colour/insert_colour`, payload);
  }

  updateColour(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Colour/Updatecolour`,payload);
  }

  deleteColour(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Colour/Deletecolour/${id}`);
  }

  getColourList(): Observable<ColourList[]> {
    return this.http.get<ColourList[]>( `${this.baseUrl}/Colour/colour_list`);
  }

  getColourById(id: number): Observable<SingleColour> {
    return this.http.get<SingleColour>( `${this.baseUrl}/Colour/colour/${id}`);
  }

  getColourDropdown(): Observable<DropColour[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/Colour/dropdown_colour_list`
    ).pipe(
      map(data =>
        data.map(item => ({
          colourId: item.colourId,
          colourName: item.colourName
        }))
      )
    );
  }


  //hsn api

  insertHsn(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Hsn/insert_hsn`,payload);
  }

  updateHsn(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Hsn/update_hsn`,payload);
  }

  deleteHsn(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Hsn/delete_hsn/${id}`);
  }

  getHsnList(): Observable<HsnList[]> {
    return this.http.get<HsnList[]>(`${this.baseUrl}/Hsn/hsn_list`);
  }

  getHsnById(id: number): Observable<SingleHsn> {
    return this.http.get<SingleHsn>(`${this.baseUrl}/Hsn/hsn/${id}`);
  }


  getHsnDropdown(): Observable<DropHsn[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/Hsn/dropdown_hsn_list`
    ).pipe(
      map(data =>
        data.map(item => ({
          hsnId: item.hsnId,
          hsnCode: item.hsnCode
        }))
      )
    );
  }


  ///mont api


  insertMonth(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Month/insert_month`,payload);
  }

 
  updateMonth(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Month/Updatemonth`,payload);
  }


  deleteMonth(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Month/Deletemonth/${id}`);
  }


  getMonthList(): Observable<MonthList[]> {
    return this.http.get<MonthList[]>(`${this.baseUrl}/Month/month_list`);
  }


  getMonthById(id: number): Observable<SingleMonth> {
    return this.http.get<SingleMonth>(`${this.baseUrl}/Month/month/${id}`);
  }

  getMonthDropdown(): Observable<DropMonth[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/Month/dropdown_month_list`
    ).pipe(
      map(data =>
        data.map(item => ({
          month_id: item.month_id,
          month_name: item.month_name
        }))
      )
    );
  }


  ///unit api

  insertUnit(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Unit/insert_unit`,payload);
  }

  updateUnit(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Unit/Updateunit`,payload);
  }

  deleteUnit(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Unit/Deleteunit/${id}`);
  }

  getUnitList(): Observable<UnitList[]> {
    return this.http.get<UnitList[]>(`${this.baseUrl}/Unit/unit_list`);
  }

  getUnitById(id: number): Observable<SingleUnit> {
    return this.http.get<SingleUnit>(`${this.baseUrl}/Unit/unit/${id}`);
  }

  getUnitDropdown(): Observable<DropUnit[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/Unit/dropdown_unit_list`
    ).pipe(
      map(data =>
        data.map(item => ({
          unitId: item.unitId,
          unitName: item.unitName
        }))
      )
    );
  }


  //paytype api

  insertPaytype(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/PayType/insert_paytype`,payload);
  }


  updatePaytype(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/PayType/update_paytype`, payload);
  }


  deletePaytype(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/PayType/delete_paytype/${id}`);
  }

  getPaytypeList(): Observable<PaytypeList[]> {
    return this.http.get<PaytypeList[]>(`${this.baseUrl}/PayType/paytype_list`);
  }


  getPaytypeById(id: number): Observable<SinglePaytype> {
    return this.http.get<SinglePaytype>(`${this.baseUrl}/PayType/paytype/${id}`);
  }

  getPaytypeDropdown(): Observable<DropPaytype[]> {
    return this.http.get<DropPaytype[]>(
      `${this.baseUrl}/PayType/dropdown_paytype_list`
    ).pipe(
      map(data =>
        data.map(item => ({
          paytypeId: item.paytypeId,
          paytypeName: item.paytypeName
        }))
      )
    );
  }

  //TransType


  insertTransType(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/TranType/insert_trans_type`,payload);
  }

  updateTransType(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/TranType/UpdateTransType`,payload);
  }


  deleteTransType(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/TranType/DeleteTransType/${id}`);
  }


  getTransTypeList(): Observable<TransTypeList[]> {
    return this.http.get<TransTypeList[]>(`${this.baseUrl}/TranType/trans_type_list`);
  }


  getTransTypeById(id: number): Observable<SingleTransType> {
    return this.http.get<SingleTransType>( `${this.baseUrl}/TranType/trans_type/${id}`);
  }


  getTransTypeDropdown(): Observable<DropTransType[]> {
    return this.http.get<DropTransType[]>(
      `${this.baseUrl}/TranType/dropdown_trans_type_list`
    ).pipe(
      map(data =>
        data.map(item => ({
          trans_id: item.trans_id,
          transtype_name: item.transtype_name
        }))
      )
    );
  }

//prodtype

  insertProdtype(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/ProdType/insert_prodtype`, payload);
  }


  updateProdtype(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/ProdType/update_prodtype`,payload);
  }

  deleteProdtype(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/ProdType/delete_prodtype/${id}`);
  }


  getProdtypeList(): Observable<ProdtypeList[]> {
    return this.http.get<ProdtypeList[]>(`${this.baseUrl}/ProdType/prodtype_list`);
  }


  getProdtypeById(id: number): Observable<SingleProdtype> {
    return this.http.get<SingleProdtype>(`${this.baseUrl}/ProdType/prodtype/${id}`);
  }


  getProdtypeDropdown(): Observable<DropProdtype[]> {
    return this.http.get<DropProdtype[]>(
      `${this.baseUrl}/ProdType/dropdown_prodtype_list`
    ).pipe(
      map(data =>
        data.map(item => ({
          prodtype_Id: item.prodtype_Id,
          prodtype_Name: item.prodtype_Name
        }))
      )
    );
  }

  //productmaster

  insertProduct(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Product/insert_product`,payload);
  }

  updateProduct(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Product/UpdateProduct`,payload);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Product/DeleteProduct/${id}`);
  }

  getProductList(): Observable<ProductList[]> {
    return this.http.get<ProductList[]>(`${this.baseUrl}/Product/product_list`);
  }

  getProductById(id: number): Observable<SingleProduct> {
    return this.http.get<SingleProduct>( `${this.baseUrl}/Product/product/${id}`);
  }

  getProductDropdown(): Observable<DropProduct[]> {
    return this.http.get<DropProduct[]>(
      `${this.baseUrl}/Product/dropdown_product_list`
    ).pipe(
      map(data =>
        data.map(item => ({
          product_Id: item.product_Id,
          product_name: item.product_name
        }))
      )
    );
  }

  //productdetails api

  insertProductDetail(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Product/insert_ProductDetail`, payload);
  }


  updateProductDetail(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Product/Update_ProductDetail`, payload);
  }


  deleteProductDetail(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Product/Delete_ProductDetail/${id}` );
  }


  getProductDetailList(): Observable<ProductDetail_List[]> {
    return this.http.get<ProductDetail_List[]>(`${this.baseUrl}/Product/productdetail_list`);
  }


  getProductDetailById(id: number): Observable<Single_ProductDetail> {
    return this.http.get<Single_ProductDetail>(`${this.baseUrl}/Product/productdetail/${id}`);
  }


  // getProductDetailDropdown(): Observable<Drop_ProductDetail[]> {
  //   return this.http.get<Drop_ProductDetail[]>(
  //     `${this.baseUrl}/ProductDetail/dropdown_productdetail_list`
  //   );
  // }


  
}
