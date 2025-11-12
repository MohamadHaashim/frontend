import { Injectable } from '@angular/core';
import { ServiceProvider } from '../service.provider';
import { map } from 'rxjs/operators';
import { ServiceConfig } from '../service.url.config';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  constructor(private dataService: ServiceProvider,public service:ServiceConfig) {}
  //caste API
  public casteCreate(data: any) {
    return this.dataService.post('casteCreate', data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public casteList(data: any) {
    return this.dataService.post('casteList', data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public casteGet(data: any) {
    console.log(data,'data');
    return this.dataService.get('casteGet', data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public casteUpdate(data:any) {
    return this.dataService.put('casteUpdate', data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public casteDelete(data: any) {
    console.log(data,'ids');
    return this.dataService.delete('casteDelete', data).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  //Religion API

  public religionCreate(data: any) {
    return this.dataService.post('religionCreate', data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public religionList(data: any) {
    return this.dataService.post('religionList', data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public religionGet(data: any) {    
    return this.dataService.get('religionGet', data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public religionUpdate(data:any) {
    return this.dataService.put('religionUpdate', data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public religionDelete(data: any) {
    return this.dataService.delete('religionDelete', data).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }



  public getCategoryList() {
    return this.dataService.get('getCategoryList').pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  public getReligionList() {
    return this.dataService.get('getReligionList').pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  public getBloodGroupList() {
    return this.dataService.get('getBloodGroupList').pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  public getMotherTongueList() {
    return this.dataService.get('getMotherTongueList').pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  public getHobbiesList() {
    return this.dataService.get('getHobbiesList').pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  public getCulturalTalentsList() {
    return this.dataService.get('getCulturalTalentsList').pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  public getHowDoYouComeList() {
    return this.dataService.get('getHowDoYouComeList').pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  public getSportsList() {
    return this.dataService.get('getSportsList').pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }

  public getStateList() {
    return this.dataService.get('getStateList').pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }

  public getDistrictList(queryParams: any) {
    return this.dataService.get('getDistrictList', queryParams).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  public getTalukList(queryParams: any) {
    return this.dataService.get('getTalukList', queryParams).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  public getPanchayatList(queryParams: any) {
    return this.dataService.get('getPanchayatList', queryParams).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  public getWardList(queryParams: any) {
    return this.dataService.get('getWardList', queryParams).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }

  public getAdmittedCategoryList() {
    return this.dataService.get('getAdmittedCategoryList').pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }

  public getClassesList() {
    return this.dataService.get('getClassesList').pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }

  public getSecondaryLanguageList() {
    return this.dataService.get('getSecondaryLanguageList').pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }

  public uploadAsset(formData: any) {
    return this.dataService.upload('uploadAssertAPI', formData).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  public addGeneralDetails(bodyParams: any) {
    return this.dataService.post('addGeneralDetails', bodyParams).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public addFeeDetails(bodyParams: any) {
    return this.dataService.post('addFeeDetails', bodyParams).pipe(
      map((data) => {
        return data;
      })
    );
  }

  // Fees Apis

  // Fees List

  public feesList(data:any) {
    return this.dataService.post('feesList').pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }

// Fees Create

public addFeesDetails(bodyParams: any) {
  return this.dataService.post('addFeesDetails', bodyParams).pipe(
    map((data) => {
      return data;
    })
  );
}

// Fees Get

public getFeesDetails(bodyParams: any) {
  return this.dataService.get('getFeesList', bodyParams).pipe(
    map((response) => {
      return response;
    })
  );
}

// Fees Edit

public getFeesEdit(bodyParams: any) {
  return this.dataService.put('getFeesEdit', bodyParams).pipe(
    map((response) => {
      return response;
    })
  );
}

// Fees Delete

public getFeesDelete(id:any) {
  return this.dataService.get('getFeesDelete', id).pipe(
    map((response) => {
      return response;
    })
  );
}

// Fees Section Dropdown 

public feesSectionDropdown() {
  return this.dataService.post('feesSectionDropdown').pipe(
    map((data) => {
      return data;
    })
  );
}

// Fees Class Dropdown 

public feesClassDropdown() {
  return this.dataService.post('feesClassDropdown').pipe(
    map((data) => {
      return data;
    })
  );
}

// General Create Method

public addGeneralDetail(bodyParams: any) {
  return this.dataService.post('addGeneralDetail', bodyParams).pipe(
    map((data) => {
      return data;
    })
  );
}











  public addSessionDetails(bodyParams: any) {
    return this.dataService.post('addSessionDetails', bodyParams).pipe(
      map((data) => {
        return data;
      })
    );
  }
  public addSubjectDetails(bodyParams: any) {
    return this.dataService.post('addSubjectDetails', bodyParams).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
