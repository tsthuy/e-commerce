import { Button } from 'antd'
import React, { useEffect } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { Link } from 'react-router-dom'

function FilterSearchNew({ data, Filter1, Filter2, searchTerm, setSearchTerm }) {

    const [filteredData, setFilteredData] = useState([]); // Holds filtered data
    const [filterType, setFilterType] = useState("all"); // Holds filter value
    useEffect(() => {
        let updatedData = [...data];
        // Apply filter based on stock or sold out
        if (filterType === Filter1) {
            updatedData = updatedData.filter((item) => item.Filter1 === Filter1);
        } else if (filterType === Filter2) {
            updatedData = updatedData.filter((item) => item.Filter2 === Filter2);
        }

        // Apply search term to filter products by name
        if (searchTerm) {
            updatedData = updatedData.filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredData(updatedData); // Update the filtered data

    }, [products, searchTerm, filterType]);
    return (
        <div className='flex justify-between'>
            {/* filter */}
            <div>
                <Select
                    defaultValue="all"
                    style={{ width: 200 }}
                    onChange={(value) => setFilterType(value)}
                >
                    <Select.Option value="AllEvents">All Events</Select.Option>
                    <Select.Option value={Filter1}>{Filter1}</Select.Option>
                    <Select.Option value={Filter2}>{Filter2}</Select.Option>
                </Select>
            </div>
            {/* search */}
            <div style={{ position: "relative", display: "inline-block" }}>
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: "5px 35px 5px 10px", // Extra padding on the right for the icon
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        width: "200px", // Adjust the width as needed
                    }}
                />
                <AiOutlineSearch
                    size={20} // Icon size
                    style={{
                        position: "absolute",
                        right: "10px", // Position it inside the input field
                        top: "50%",
                        transform: "translateY(-50%)", // Center the icon vertically
                        color: "#60A5FA", // Icon color
                        cursor: "pointer",
                    }}
                />
            </div>
            {/* add new */}
            <div>
                <Link to={"/dashboard-create-product"}>
                    <Button type="default" className="bg-blue-400">
                        + Add new
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default FilterSearchNew
