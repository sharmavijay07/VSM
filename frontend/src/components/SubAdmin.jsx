"use client"

import { useState, useEffect } from "react"
import api from "../api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  Building2,
  CheckCircle2,
  AlertCircle,
  BarChart4,
  DollarSign,
} from "lucide-react"

const SubAdminPage = () => {
  const [users, setUsers] = useState([])
  const [companies, setCompanies] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [quantity, setQuantity] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("") // "success" or "error"
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
    fetchCompanies()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/superadmin/users")
      setUsers(response.data.filter((user) => user.role === "customer"))
    } catch (err) {
      console.error("Error fetching users")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/superadmin/companies")
      setCompanies(response.data)
    } catch (err) {
      console.error("Error fetching companies")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTransaction = async (action) => {
    if (!selectedCustomer || !selectedCompany || !quantity) {
      setMessage("Please fill all fields")
      setMessageType("error")
      return
    }

    try {
      setIsLoading(true)
      const endpoint = action === "buy" ? "/subadmin/buy-shares" : "/subadmin/sell-shares"
      await api.post(endpoint, {
        customerId: selectedCustomer,
        companyId: selectedCompany,
        quantity: Number.parseInt(quantity),
      })
      setMessage(`Shares ${action === "buy" ? "purchased" : "sold"} successfully`)
      setMessageType("success")

      // Reset form
      setQuantity("")
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.message || "Transaction failed"}`)
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  const clearMessage = () => {
    setMessage("")
    setMessageType("")
  }

  const getSelectedCustomerName = () => {
    const customer = users.find((user) => user._id === selectedCustomer)
    return customer ? customer.email : "Select a customer"
  }

  const getSelectedCompanyName = () => {
    const company = companies.find((company) => company._id === selectedCompany)
    return company ? company.companyName : "Select a company"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Sub Admin Dashboard</h2>
            <p className="text-slate-500 dark:text-slate-400">Manage customer transactions and portfolios</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Button variant="outline" onClick={fetchUsers} className="border-slate-300 dark:border-slate-600">
              <Users className="mr-2 h-4 w-4" /> Refresh Users
            </Button>
            <Button variant="outline" onClick={fetchCompanies} className="border-slate-300 dark:border-slate-600">
              <Building2 className="mr-2 h-4 w-4" /> Refresh Companies
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-none shadow-lg bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-100">Transaction Management</CardTitle>
                <CardDescription>Buy or sell shares on behalf of customers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Select Customer</label>
                    <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user._id} value={user._id}>
                            {user.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Select Company</label>
                    <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company._id} value={company._id}>
                            {company.companyName} - ${company.shareValue}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Quantity</label>
                  <Input
                    type="number"
                    placeholder="Enter number of shares"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    className="w-full"
                  />
                </div>

                {message && (
                  <div
                    className={`p-4 rounded-lg flex items-center justify-between ${
                      messageType === "success"
                        ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    <div className="flex items-center">
                      {messageType === "success" ? (
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                      ) : (
                        <AlertCircle className="h-5 w-5 mr-2" />
                      )}
                      <p>{message}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearMessage}
                      className={messageType === "success" ? "hover:bg-emerald-100" : "hover:bg-red-100"}
                    >
                      Dismiss
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
                  onClick={() => handleTransaction("buy")}
                  disabled={isLoading}
                >
                  <ArrowDownToLine className="mr-2 h-4 w-4" /> Buy Shares
                </Button>
                <Button
                  className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
                  onClick={() => handleTransaction("sell")}
                  disabled={isLoading}
                >
                  <ArrowUpFromLine className="mr-2 h-4 w-4" /> Sell Shares
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card className="border-none shadow-lg bg-white dark:bg-slate-800 h-full">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800 dark:text-slate-100">Transaction Summary</CardTitle>
                <CardDescription>Current selection details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Customer</p>
                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-blue-500" />
                      {getSelectedCustomerName()}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Company</p>
                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-purple-500" />
                      {getSelectedCompanyName()}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Quantity</p>
                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center">
                      <BarChart4 className="h-4 w-4 mr-2 text-amber-500" />
                      {quantity || "Not specified"}
                    </p>
                  </div>

                  {selectedCompany && quantity && (
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Estimated Value</p>
                      <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-emerald-500" />
                        {(() => {
                          const company = companies.find((c) => c._id === selectedCompany)
                          if (company && quantity) {
                            return `$${(company.shareValue * Number.parseInt(quantity)).toFixed(2)}`
                          }
                          return "N/A"
                        })()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubAdminPage

