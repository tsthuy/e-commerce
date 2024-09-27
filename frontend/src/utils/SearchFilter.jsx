import { Button, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const SearchFilter = ({
    data,
    filterKey = "status", // Default filter by "status"
    filterOptions, // Array of filter options {value: "Processing refund", label: "Processing Refund"}
    searchPaths, // Đường dẫn để tìm kiếm (có thể là chuỗi hoặc mảng chuỗi)
    searchPlaceholder = "Search by name", // Placeholder cho input tìm kiếm
    addNewLink, // Link cho nút Add new
    setFilteredData, // Callback để trả dữ liệu đã lọc
}) => {
    const [filterType, setFilterType] = useState("all"); // Giữ giá trị filter được chọn
    const [searchTerm, setSearchTerm] = useState(""); // Giữ giá trị tìm kiếm

    useEffect(() => {
        let updatedData = [...data]; // Clone data để tránh mutate dữ liệu gốc

        // Áp dụng filter theo filterKey
        if (filterType !== "all") {
            updatedData = updatedData.filter(item => {
                const filterValue = getNestedValue(item, filterKey);
                return filterValue === filterType;
            });
        }

        // Áp dụng tìm kiếm theo searchPaths (có thể là đường dẫn sâu)
        if (searchTerm) {
            updatedData = updatedData.filter(item => {
                // Nếu searchPaths là mảng, ta duyệt qua từng đường dẫn để tìm giá trị
                const paths = Array.isArray(searchPaths) ? searchPaths : [searchPaths];
                return paths.some(path => {
                    const value = getNestedValue(item, path);
                    return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
                });
            });
        }

        // Cập nhật dữ liệu đã lọc
        setFilteredData(updatedData);
    }, [filterType, searchTerm]);

    // Hàm giúp lấy giá trị từ các đường dẫn sâu (nested path)
    const getNestedValue = (obj, keyPath) => {
        return keyPath.split('.').reduce((acc, key) => {
            const arrayMatch = key.match(/(\w+)\[(\d+)\]/); // Xử lý cú pháp mảng (vd: "cart[0]")
            if (arrayMatch) {
                const arrayKey = arrayMatch[1]; // Lấy tên mảng (vd: "cart")
                const index = arrayMatch[2]; // Lấy chỉ số mảng (vd: "0")
                return acc && acc[arrayKey] ? acc[arrayKey][index] : undefined;
            }
            return acc ? acc[key] : undefined;
        }, obj);
    };

    return (
        <div className='flex justify-between'>
            {/* Bộ lọc dạng dropdown */}
            <div>
                <Select
                    defaultValue="all"
                    style={{ width: 200 }}
                    onChange={setFilterType}
                >
                    <Select.Option value="all">All</Select.Option>
                    {filterOptions.map((option, index) => (
                        <Select.Option key={index} value={option.value}>
                            {option.label}
                        </Select.Option>
                    ))}
                </Select>
            </div>

            {/* Input tìm kiếm */}
            <div style={{ position: "relative", display: "inline-block" }}>
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: "5px 35px 5px 10px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        width: "200px",
                    }}
                />
                <AiOutlineSearch
                    size={20}
                    style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#60A5FA",
                        cursor: "pointer",
                    }}
                />
            </div>

            {/* Nút Add new */}
            {addNewLink && <div>
                <Link to={addNewLink}>
                    <Button type="default" className="bg-blue-400">
                        + Add new
                    </Button>
                </Link>
            </div>}

        </div>
    );
};

export default SearchFilter;
