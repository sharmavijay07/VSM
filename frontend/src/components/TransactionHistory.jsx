"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpFromLine, ArrowDownToLine, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

/**
 * @typedef {Object} Transaction
 * @property {string} _id
 * @property {Object} customerId
 * @property {string} customerId._id
 * @property {string} customerId.email
 * @property {Object} companyId
 * @property {string} companyId._id
 * @property {string} companyId.companyName
 * @property {number} companyId.shareValue
 * @property {Object} subAdminId
 * @property {string} subAdminId._id
 * @property {string} subAdminId.email
 * @property {('buy'|'sell')} transactionType
 * @property {number} quantity
 * @property {number} shareValue
 * @property {number} totalValue
 * @property {string} timestamp
 */

/**
 * Transaction History Component
 * @param {Object} props
 * @param {Transaction[]} props.transactions - List of transactions
 * @param {('customer'|'subadmin'|'superadmin')} props.viewType - Type of view
 */
export const TransactionHistory = ({ transactions, viewType }) => {
  const [page, setPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const paginatedTransactions = transactions.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <Card className="border-none shadow-lg bg-white dark:bg-slate-800">
      <CardHeader>
        <CardTitle className="text-xl text-slate-800 dark:text-slate-100">Transaction History</CardTitle>
        <CardDescription>
          {viewType === "customer"
            ? "Your buy and sell history"
            : viewType === "subadmin"
              ? "Transactions you've processed for customers"
              : "All transactions in the system"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                {(viewType === "subadmin" || viewType === "superadmin") && <TableHead>Customer</TableHead>}
                <TableHead>Company</TableHead>
                {viewType === "superadmin" && <TableHead>Sub Admin</TableHead>}
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Share Value</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-slate-400" />
                        <span className="text-sm">
                          {formatDistanceToNow(new Date(transaction.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                    </TableCell>
                    {(viewType === "subadmin" || viewType === "superadmin") && (
                      <TableCell>{transaction.customerId.email}</TableCell>
                    )}
                    <TableCell>{transaction?.companyId?.companyName}</TableCell>
                    {viewType === "superadmin" && <TableCell>{transaction.subAdminId.email}</TableCell>}
                    <TableCell>
                      {transaction.transactionType === "buy" ? (
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400">
                          <ArrowDownToLine className="mr-1 h-3 w-3" /> Buy
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400">
                          <ArrowUpFromLine className="mr-1 h-3 w-3" /> Sell
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{transaction.quantity}</TableCell>
                    <TableCell>${transaction.shareValue.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">${transaction.totalValue.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={viewType === "superadmin" ? 8 : viewType === "subadmin" ? 7 : 6}
                    className="text-center py-6"
                  >
                    No transaction history found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Page {page} of {totalPages}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
              >
                <span className="sr-only">Previous page</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
              >
                <span className="sr-only">Next page</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

