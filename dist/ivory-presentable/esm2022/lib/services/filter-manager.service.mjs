import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class FilterManagerService {
    constructor() {
        this.queryModel = {};
    }
    processFilterOptions(arr) {
        let temp = [];
        for (const i of arr) {
            temp.push({ option: i, isSelected: false });
        }
        return temp;
    }
    buildQueryModel(data) {
        if (this.queryModel[data.column] === undefined || this.queryModel[data.column] === null) {
            this.queryModel[data.column] = {};
        }
        if (data.type === 'options') {
            if (data.values.length > 0) {
                this.queryModel[data.column]['type'] = data['type'];
                this.queryModel[data.column]['values'] = data['values'];
            }
            else {
                delete this.queryModel[data.column];
            }
        }
        else if (data.type === 'text') {
            if (data.keyword !== '') {
                this.queryModel[data.column]['type'] = data['type'];
                this.queryModel[data.column]['keyword'] = data['keyword'];
            }
            else {
                delete this.queryModel[data.column];
            }
        }
    }
    getQueryModel() {
        return this.queryModel;
    }
    resetQueryModel() {
        this.queryModel = {};
    }
    filterData(data, query) {
        const filtered = data.filter((item) => {
            for (let key in query) {
                if (query[key]['type'] === 'text') {
                    const regexp = new RegExp(query[key]['keyword'], 'i');
                    if (!regexp.test(item[key])) {
                        return false;
                    }
                }
                else if (query[key]['type'] === 'options') {
                    if (!query[key]['values'].includes(item[key])) {
                        return false;
                    }
                }
            }
            return true;
        });
        return filtered;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: FilterManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: FilterManagerService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: FilterManagerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLW1hbmFnZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2l2b3J5LXByZXNlbnRhYmxlL3NyYy9saWIvc2VydmljZXMvZmlsdGVyLW1hbmFnZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUszQyxNQUFNLE9BQU8sb0JBQW9CO0lBSS9CO1FBRk8sZUFBVSxHQUFRLEVBQUUsQ0FBQztJQUVaLENBQUM7SUFFakIsb0JBQW9CLENBQUMsR0FBUTtRQUMzQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZCxLQUFLLE1BQU0sQ0FBQyxJQUFJLEdBQUcsRUFBRTtZQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUM3QztRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELGVBQWUsQ0FBQyxJQUFTO1FBQ3ZCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUcsU0FBUyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFHLElBQUksRUFBRTtZQUNuRixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDbkM7UUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUcsU0FBUyxFQUFFO1lBQ3pCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3BELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUN6RDtpQkFBTTtnQkFDTCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3JDO1NBQ0Y7YUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUcsTUFBTSxFQUFFO1lBQzdCLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBRyxFQUFFLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQzNEO2lCQUFNO2dCQUNMLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDckM7U0FDRjtJQUNILENBQUM7SUFFRCxhQUFhO1FBQ1gsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVELFVBQVUsQ0FBQyxJQUFTLEVBQUUsS0FBVTtRQUM5QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUU7WUFDekMsS0FBSyxJQUFJLEdBQUcsSUFBSSxLQUFLLEVBQUU7Z0JBQ3JCLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFHLE1BQU0sRUFBRTtvQkFDL0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUN0RCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTt3QkFDM0IsT0FBTyxLQUFLLENBQUM7cUJBQ2Q7aUJBQ0Y7cUJBQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUcsU0FBUyxFQUFFO29CQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTt3QkFDN0MsT0FBTyxLQUFLLENBQUM7cUJBQ2Q7aUJBQ0Y7YUFDRjtZQUNELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDOzhHQTdEVSxvQkFBb0I7a0hBQXBCLG9CQUFvQixjQUZuQixNQUFNOzsyRkFFUCxvQkFBb0I7a0JBSGhDLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBGaWx0ZXJNYW5hZ2VyU2VydmljZSB7XG5cbiAgcHVibGljIHF1ZXJ5TW9kZWw6IGFueSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgcHJvY2Vzc0ZpbHRlck9wdGlvbnMoYXJyOiBhbnkpIHtcbiAgICBsZXQgdGVtcCA9IFtdO1xuICAgIGZvciAoY29uc3QgaSBvZiBhcnIpIHtcbiAgICAgIHRlbXAucHVzaCh7IG9wdGlvbjogaSwgaXNTZWxlY3RlZDogZmFsc2UgfSk7XG4gICAgfVxuICAgIHJldHVybiB0ZW1wO1xuICB9XG5cbiAgYnVpbGRRdWVyeU1vZGVsKGRhdGE6IGFueSkge1xuICAgIGlmICh0aGlzLnF1ZXJ5TW9kZWxbZGF0YS5jb2x1bW5dPT09dW5kZWZpbmVkIHx8IHRoaXMucXVlcnlNb2RlbFtkYXRhLmNvbHVtbl09PT1udWxsKSB7XG4gICAgICB0aGlzLnF1ZXJ5TW9kZWxbZGF0YS5jb2x1bW5dID0ge307XG4gICAgfVxuICAgIFxuICAgIGlmIChkYXRhLnR5cGU9PT0nb3B0aW9ucycpIHtcbiAgICAgIGlmIChkYXRhLnZhbHVlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMucXVlcnlNb2RlbFtkYXRhLmNvbHVtbl1bJ3R5cGUnXSA9IGRhdGFbJ3R5cGUnXTtcbiAgICAgICAgdGhpcy5xdWVyeU1vZGVsW2RhdGEuY29sdW1uXVsndmFsdWVzJ10gPSBkYXRhWyd2YWx1ZXMnXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnF1ZXJ5TW9kZWxbZGF0YS5jb2x1bW5dO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGF0YS50eXBlPT09J3RleHQnKSB7XG4gICAgICBpZiAoZGF0YS5rZXl3b3JkIT09JycpIHtcbiAgICAgICAgdGhpcy5xdWVyeU1vZGVsW2RhdGEuY29sdW1uXVsndHlwZSddID0gZGF0YVsndHlwZSddO1xuICAgICAgICB0aGlzLnF1ZXJ5TW9kZWxbZGF0YS5jb2x1bW5dWydrZXl3b3JkJ10gPSBkYXRhWydrZXl3b3JkJ107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWxldGUgdGhpcy5xdWVyeU1vZGVsW2RhdGEuY29sdW1uXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRRdWVyeU1vZGVsKCkge1xuICAgIHJldHVybiB0aGlzLnF1ZXJ5TW9kZWw7XG4gIH1cblxuICByZXNldFF1ZXJ5TW9kZWwoKSB7XG4gICAgdGhpcy5xdWVyeU1vZGVsID0ge307XG4gIH1cblxuICBmaWx0ZXJEYXRhKGRhdGE6IGFueSwgcXVlcnk6IGFueSkge1xuICAgIGNvbnN0IGZpbHRlcmVkID0gZGF0YS5maWx0ZXIoKGl0ZW06IGFueSkgPT4ge1xuICAgICAgZm9yIChsZXQga2V5IGluIHF1ZXJ5KSB7XG4gICAgICAgIGlmIChxdWVyeVtrZXldWyd0eXBlJ109PT0ndGV4dCcpIHtcbiAgICAgICAgICBjb25zdCByZWdleHAgPSBuZXcgUmVnRXhwKHF1ZXJ5W2tleV1bJ2tleXdvcmQnXSwgJ2knKTtcbiAgICAgICAgICBpZiAoIXJlZ2V4cC50ZXN0KGl0ZW1ba2V5XSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocXVlcnlba2V5XVsndHlwZSddPT09J29wdGlvbnMnKSB7XG4gICAgICAgICAgaWYgKCFxdWVyeVtrZXldWyd2YWx1ZXMnXS5pbmNsdWRlcyhpdGVtW2tleV0pKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gZmlsdGVyZWQ7XG4gIH1cblxufVxuIl19