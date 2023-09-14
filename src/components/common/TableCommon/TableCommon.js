import React from 'react';
import PropTypes from 'prop-types';
import { Table } from "antd";
import './index.scss';

function TableCommon(props) {

    const {
        columns, // cấu hình của các cột
        data, // data của bảng
        primaryKey, // key chính của data
        parseFunction, // tùy chỉnh hiển thị data
        isShowPaging, // check có hiển thị phân trang hay không
        currentPage, // page hiện tại
        totalDisplay, // tổng số bản ghi trên 1 trang
        onChangePage, // xử lý mỗi khi thay đổi page return về page được chọn\
        iterablePaging, // các config còn lại của paging ant design
        defaultPage, // page default hiển thị
        totalCountData, // tổng tất cả bản ghi
        classNameTable, // class để style cho table
        iterableExpand, // các config còn lại của expand trong antd
        renderExpandContent, // render expend 
        expandCondition, // check điều kiện để expand
        ...iterableProps // props còn lại của antd nếu cần
    } = props;

    const handleChangePage = (page, pageSize) => {
        if (page === currentPage) {
            return;
        }
        onChangePage(page, pageSize);
    };

    // convert config hiện tại sang config table antd
    const getColumns = () => {
        let expandIndex = null;
        const newColumns = columns.map((item, index) => {
            if (item.expand) {
                expandIndex = index;
            }
            return ({
                ...item,
                title: item.title,
                dataIndex: item.dataIndex,
                key: item.dataIndex,
                width: item.width,
                render: (text, record, index) => {
                    if (parseFunction) {
                        return parseFunction(record, item.dataIndex, isShowPaging ? (currentPage - 1) * totalDisplay + index : index)
                    }
                    return <span>{text}</span>
                },
            });
        });
        newColumns.splice(expandIndex, 0, Table.EXPAND_COLUMN);
        return newColumns;
    };

    const getData = () => data.map((item, index) => ({
        ...item,
        key: primaryKey && item[primaryKey] ? item[primaryKey] : `${index}`
    }));

    // config của phân trang
    const getPaginationConfig = () => {
        if (isShowPaging) {
            return {
                ...iterablePaging,
                current: currentPage,
                defaultCurrent: defaultPage,
                pageSize: totalDisplay,
                pageSizeOptions: [10, 20, 50, 100],
                total: totalCountData,
                onChange: (page, pageSize) => handleChangePage(page, pageSize),
            }
        }
        return false;
    };

    // config expand
    const getExpandableConfig = () => ({
        ...iterableExpand,
        expandedRowRender: renderExpandContent ? (record, index, indent, expanded) => renderExpandContent(record, index, indent, expanded) : null,
        rowExpandable: expandCondition ? (record) => expandCondition(record) : null,
    });

    return (
        <div className="root" >
            <Table
                rowKey={primaryKey}
                columns={getColumns()}
                dataSource={getData()}
                pagination={getPaginationConfig()}
                expandable={getExpandableConfig()}
                className={classNameTable}
                {...iterableProps}
            />
        </div>
    );
};

TableCommon.propTypes = {
    columns: PropTypes.objectOf(PropTypes.array.isRequired),
    data: PropTypes.objectOf(PropTypes.array.isRequired),
    primaryKey: PropTypes.string.isRequired,
    parseFunction: PropTypes.func.isRequired,
    isShowPaging: PropTypes.bool,
    currentPage: PropTypes.number,
    totalDisplay: PropTypes.number,
    onChangePage: PropTypes.func,
    iterablePaging: PropTypes.objectOf(PropTypes.object),
    defaultPage: PropTypes.number,
    totalCountData: PropTypes.number,
    classNameTable: PropTypes.string,
    iterableExpand: PropTypes.objectOf(PropTypes.object),
    expandCondition: PropTypes.func,
    renderExpandContent: PropTypes.func,
};

TableCommon.defaultProps = {
    columns: [],
    data: [],
    parseFunction: () => { },
    isShowPaging: false,
    onChangePage: () => { },
    classNameTable: '',
    totalCountData: 0,
    totalDisplay: 15,
    defaultPage: 1,
    currentPage: 1,
};

export default TableCommon;