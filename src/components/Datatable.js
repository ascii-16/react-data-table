import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './Datatable.scss';
import { 
    Check, 
    KeyboardArrowDown, 
    KeyboardArrowUp, 
    ArrowUpward,
    ArrowDownward
  } from '@material-ui/icons';

const Datatable = (props) => {
  const columns = Object.keys(props.data[0]);
  const [showCount, setShowCount] = useState(10);
  const [data, setData] = useState(props.data.slice(0, showCount));
  const [search, setSearch] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeColumns, setActive] = useState([...columns]);
  const [showViewFilter,setshowViewFilter] = useState(false);
  const [sort, setSort] = useState({column: "id", order: "asc"});

  useEffect(() => {
    Pagination();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, showCount, search]);

  const filterOptions = [
    { label: "10", value: "10"},
    { label: "25", value: "25"},
    { label: "50", value: "50"},
    { label: "all", value: "all"},
  ]

  let viewOptions  = [];

  columns.map(column => {
    let option =  { 
      label: column.replace("_", " "), 
      value: column, 
      checked: true,
    };
    viewOptions.push(option);
  })
  

  const TableHead = () => {
    return (
      <thead>
        <tr>
          { columns.map((column, index) => 
            activeColumns.includes(column) && 
            <th key={index} onClick={() => sortData(column)}> 
              {column.replace("_", " ")} 
              { column === sort.column ?
                sort.order === "asc" ?
                <ArrowUpward/> :
                <ArrowDownward/> : ""
              }
            </th>
          )}
        </tr>
      </thead>
    )
  }

  const TableBody = (prop) => {
    return (
      <tbody>
        { data.map((item, index) => 
          <tr key={index}>
            { columns.map((column, index) => 
              activeColumns.includes(column) && 
              <td key={index}>
                <span class="title-sm">{ column.replace("_", " ") }</span> 
                {item[column]}
              </td>
            )}
          </tr>
        )}
      </tbody>
    )
  }

  const sortData = (column, ord = null) => {
    let order;

    if(ord) {
      order = ord;
    } else {
      if(sort.column === column) {
        order = (sort.order === "asc") ? "desc" : "asc";
      } else {
        order = "asc";
      }
    }

    setSort({column: column, order: order});

    let sortData;
    if (order === "asc") {
      sortData = props.data.sort((a, b) => (a[column] > b[column]) ? 1 : ((b[column] > a[column]) ? -1 : 0))
    } else {
      sortData = props.data.sort((a, b) => (a[column] < b[column]) ? 1 : ((b[column] < a[column]) ? -1 : 0))
    }

    setData(sortData.slice(0, showCount));
    setCurrentPage(0);
  }

  const searchTable = (event) => {
    const searchKey = event.target.value.toLowerCase();
    setSearch(searchKey);
    setCurrentPage(0);

    if(searchKey.length > 0) {
      const results = props.data.filter( item => 
        item.first_name.toLowerCase().includes(searchKey) ||
        item.last_name.toLowerCase().includes(searchKey) ||
        item.email.toLowerCase().includes(searchKey) ||
        item.job_title.toLowerCase().includes(searchKey)
      );
      setData(results);
    } else {
      setData(props.data.slice(0, showCount));
    }
  }


  const Pagination = () => {
    const count = props.data.length / showCount;
    const pages = new Array(pageCount).fill("page");
    
    (count % 1) === 0 ? setPageCount(count) : setPageCount(count + 1);

    return (
      <nav aria-label="Page navigation example">
        { search.length === 0 &&  <ul className="pagination">
          <li className={ 
            currentPage === 0 ? 
            "page-item disabled" : 
            "page-item"
          }>
            <button 
              className="page-link" 
              href="#"
              onClick={() => setPagination(currentPage - 1)}>Previous</button>
          </li>
          <span class="pages">
          { pages.map((item, index) =>
            <li 
              className={ 
                currentPage === index ? 
                "page-item active" : 
                "page-item"
              } 
              key={index}>
              <button 
                className="page-link" 
                href="#"
                onClick={() => setPagination(index)}>{index + 1}</button>
            </li>
          )}
          </span>
          <li 
            className={ 
              currentPage === ((props.data.length / showCount) - 1) ? 
              "page-item disabled" : 
              "page-item"
          }>
            <button 
              className="page-link"
              href="#"
              onClick={() => setPagination(currentPage + 1)}>Next</button>
          </li>
        </ul> }
      </nav>
    )
  }

  const setPagination = (index) => {
    setData(props.data.slice(index * showCount, (index + 1) * showCount));
    setCurrentPage(index);
  }

  const handleFilterChange = (selectedOption) => {
    const value = selectedOption.value;

    if (value === 'all') {
      setShowCount(props.data.length);
      setData(props.data.slice(0, props.data.length))
    } else {
      setShowCount(value);
      setData(props.data.slice(0, value))
    }
  }

  const handleViewChange = (index) => {
    const value = viewOptions[index].value;
    const checked = viewOptions[index].checked;
    
    if(checked) {
      if(!activeColumns.includes(value)) {
        setActive(pre => ([...pre, value]))
      } else {
        const i = activeColumns.indexOf(value);
        if(activeColumns.includes(value)) {
          let values = activeColumns.filter( (item, index) => index !== i )
          setActive(values);
        }
      }
    } else {
      const i = activeColumns.indexOf(value);
      if(activeColumns.includes(value)) {
        let values = activeColumns.filter( (item, index) => index !== i )
        setActive(values);
      }
    }

    viewOptions[index].checked = !checked;
  }

  const reset = () => {
    setCurrentPage(0);
    sortData("id","asc");
    setShowCount(10);
    setSearch("");
    setshowViewFilter(...columns);
  }

  return (
    <div className="Data-table-wrap container">
      <div className="Table-actions">
        <div className="Search-form">
          <input 
            type="text" 
            placeholder="search"
            className="form-control"
            value={search}
            onChange={searchTable}>
          </input>
        </div>
        <div className="Filter-actions">
          <div className="Range-select">
            <Select
              defaultValue={filterOptions[0]}
              onChange={handleFilterChange}
              options={filterOptions}
              menuShouldScrollIntoView
            />
          </div>
          <div className="View-select">
            <button 
              class="btn btn-outline-primary"
              onClick={() => setshowViewFilter(!showViewFilter)}>
              View { showViewFilter ?  <KeyboardArrowUp/> : <KeyboardArrowDown/> }
            </button>
            { showViewFilter && <ul>
              { viewOptions.map((option, index) => 
                <li 
                  class="option"
                  key={index}
                  onClick={() => handleViewChange(index)}
                  className={activeColumns.includes(option.value) ? "checked" : ""}>
                  {option.label}
                  {activeColumns.includes(option.value) && <Check/>}
                </li>
              )}
            </ul>}
          </div>
          {/* <button 
            class="btn btn-outline-primary btn-reset"
            onClick={reset}>Reset</button> */}
        </div>
      </div>
      <div class="Table-wrap">
        <table className="Data-table table table-hover">
          <TableHead/>
          <TableBody/>
        </table>
      </div>
      <Pagination/>
    </div>
  )
}

export default Datatable;