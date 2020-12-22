// @ts-nocheck
export default function objectTransform(obj, parent = null) {
  const myOperators = ['$or', '$from', '$to', '$after', '$before', '$null'];
  const ignoreKeys = ['$sort', '$page', '$perPage'];
  const filters = {};
  const partialFilters = [];
  if (((obj.$from) && (!obj.$to)) || ((obj.$to) && (!obj.$from))) {
    throw new Error('"$from" operator requires "$to".');
  } else {
    const allFilters = [];
    Object.entries(obj).forEach((value, index, array) => {
      let validFilters = true;
      if (value === '$sort') {
        const sortFilters = [];
        Object.entries(array[index]).forEach((value2, index2) => {
          const filter = {
            field: value2,
            direction: array[index][index2],
          };
          sortFilters.push(filter);
        });
        filters.sort_orders = sortFilters;
      } else if (value === '$perPage') {
        filters.page_size = array[index];
      } else if (value === '$page') {
        filters.current_page = array[index];
      } else if (myOperators.includes(value) && !ignoreKeys.includes(value)) {
        let filter = {};
        if (value === '$or') {
          if (!parent) {
            if (array[index].length) {
              const arr = [];
              array[index].map((o) => {
                validFilters = false;
                const tempFilter = objectTransform(o, true);
                arr.push(tempFilter[0]);
                return true;
              });
              allFilters.push({ filters: arr });
            } else {
              filter = objectTransform(value, true);
            }
          } else {
            throw new Error('Cannot execute nested OR searches.');
          }
        } else if (value === '$from') {
          filter = {
            field: 'created_at',
            value: array[index].toString(),
            condition_type: 'from',
          };
        } else if (value === '$to') {
          filter = {
            field: 'created_at',
            value: obj[key].toString(),
            condition_type: 'to',
          };
        } else if (key == '$after') {
          filter = {
            field: 'created_at',
            value: obj[key].toString(),
            condition_type: 'gt',
          };
        } else if (key == '$before') {
          filter = {
            field: 'created_at',
            value: obj[key].toString(),
            condition_type: 'lt',
          };
        } else {
          throw new Error('Invalid Operation Key.');
        }
        if (validFilters) {
          partialFilters.push(filter);
          allFilters.push({ filters: [].concat(filter) });
        }
      }
    });

    for (const key of Object.keys(obj)) {
      let validFilters = true;
      if (key == '$sort') {
        const sortFilters = [];
        for (const key2 in obj[key]) {
          const filter = {
            field: key2,
            direction: obj[key][key2],
          };
          sortFilters.push(filter);
        }
        filters.sort_orders = sortFilters;
      } else if (key == '$perPage') {
        filters.page_size = obj[key];
      } else if (key == '$page') {
        filters.current_page = obj[key];
      } else if (myOperators.includes(key) && !ignoreKeys.includes(key)) {
        let filter = {};
        if (key == '$or') {
          if (!parent) {
            if (obj[key].length) {
              const arr = [];
              obj[key].map((o) => {
                validFilters = false;
                const temp_filter = objectTransform(o, true);
                arr.push(temp_filter[0]);
              });
              allFilters.push({ filters: arr });
            } else {
              filter = objectTransform(obj[key], true);
            }
          } else {
            throw new Error('Cannot execute nested OR searches.');
          }
        } else if (key == '$from') {
          filter = {
            field: 'created_at',
            value: obj[key].toString(),
            condition_type: 'from',
          };
        } else if (key == '$to') {
          filter = {
            field: 'created_at',
            value: obj[key].toString(),
            condition_type: 'to',
          };
        } else if (key == '$after') {
          filter = {
            field: 'created_at',
            value: obj[key].toString(),
            condition_type: 'gt',
          };
        } else if (key == '$before') {
          filter = {
            field: 'created_at',
            value: obj[key].toString(),
            condition_type: 'lt',
          };
        } else {
          throw new Error('Invalid Operation Key.');
        }
        if (validFilters) {
          partialFilters.push(filter);
          allFilters.push({ filters: [].concat(filter) });
        }
      } else {
        const filter = {
          field: key,
          value: obj[key].toString(),
          condition_type: 'eq',
        };
        partialFilters.push(filter);
        allFilters.push({ filters: [].concat(filter) });
      }
    }

    if (parent) {
      return partialFilters;
    }

    filters.filter_groups = allFilters;
    return filters;
  }
}
