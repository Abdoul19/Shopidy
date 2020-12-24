/* eslint-disable prefer-destructuring */
/* eslint-disable import/prefer-default-export */
import qs from 'qs';

export class RequestParser {
  constructor() {
    this.criterias = {};
    this.filterGroup = {};
    this.filters = {};
    this.sort = {};

    this.filterGroup.filters = [];
    this.criterias.filter_groups = [];
    this.criterias.sortOrders = [];
    this.searchObject = {};
    this.operators = ['range', 'contain', 'greatThan', 'lessThan', 'include', 'equal'];
  }

  parse(request) {
    if (typeof request === 'object' && request !== null) {
      Object.entries(request).forEach((element) => {
        if (element[0] === 'filters') {
          const items = element[1];
          items.forEach((item) => {
            if (this.operators.includes(item.condition)) {
              if (item.condition === 'include') {
                if (item.value.includes(' ')) {
                  const value = item.value.split(' ').join('').toString();
                  const filter = {
                    field: item.field,
                    value,
                    condition_type: 'finset',
                  };
                  this.filterGroup.filters.push(filter);
                } else {
                  const filter = {
                    field: item.field,
                    value: item.value,
                    condition_type: 'finset',
                  };
                  this.filterGroup.filters.push(filter);
                }
              } else if (item.condition === 'range') {
                const from = {
                  field: item.field,
                  value: item.startValue,
                  condition_type: 'from',
                };

                const to = {
                  field: item.field,
                  value: item.stopValue,
                  condition_type: 'to',
                };

                this.filterGroup.filters.push(from, to);
              } else if (item.condition === 'contain') {
                const filter = {
                  field: item.field,
                  value: `%25${item.value}%25`,
                  condition_type: 'like',
                };
                this.filterGroup.filters.push(filter);
              } else if (item.condition === 'greatThan') {
                const filter = {
                  field: item.field,
                  value: item.value,
                  condition_type: 'gteq',
                };
                this.filterGroup.filters.push(filter);
              } else if (item.condition === 'lessThan') {
                const filter = {
                  field: item.field,
                  value: item.value,
                  condition_type: 'lteq',
                };
                this.filterGroup.filters.push(filter);
              } else if (item.condition === 'equal') {
                const filter = {
                  field: item.field,
                  value: item.value,
                  condition_type: 'eq',
                };
                this.filterGroup.filters.push(filter);
              }
            } else {
              throw new Error(`Unreconized filter: ${item.condition}`);
            }
          });
        } else if (element[0] === 'sort') {
          const sort = {
            field: element[1].field,
            direction: element[1].direction,
          };
          this.criterias.sortOrders.push(sort);
        } else if (element[0] === 'pageSize') {
          this.criterias.pageSize = element[1];
        } else if (element[0] === 'currentPage') {
          this.criterias.currentPage = element[1];
        }
      });
    }

    this.criterias.filter_groups.push(this.filterGroup);
    this.searchObject.searchCriteria = this.criterias;

    const stringFilters = qs.stringify(this.searchObject, { encode: false });
    return stringFilters;
  }
}
