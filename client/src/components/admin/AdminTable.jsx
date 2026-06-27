function AdminTable({
    title,
    columns,
    data = [],
    actions,
    totalUsers = 0,
    landlords = 0,
    tenants = 0,
    usersByCountry = {}
}) {
    return (
        <div className="admin-table-container">
            <h1>{title}</h1>
            
            <table className="admin-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key}>
                                {column.label}
                            </th>
                        ))}

                        {actions && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>

                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={
                                    columns.length +
                                    (actions ? 1 : 0)
                                }
                            >
                                No records found
                            </td>
                        </tr>
                    ) : (

                        data.map((row) => (
                            <tr key={row._id}>
                                {columns.map(col => (
                                    <td key={col.key}>
                                        {col.render
                                            ? col.render(row[col.key], row)
                                            : row[col.key]}
                                    </td>
                                ))}

                                {actions && (
                                    <td>
                                        {actions(row)}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AdminTable;