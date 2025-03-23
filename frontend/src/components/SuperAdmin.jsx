"use client"

import { useState, useEffect } from "react"
import api from "../api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Users,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  DollarSign,
  Package,
  UserCog,
  Search,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const SuperAdminPage = () => {
  const [users, setUsers] = useState([])
  const [companies, setCompanies] = useState([])
  const [newCompany, setNewCompany] = useState({
    companyName: "",
    shareValue: "",
    quantity: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("companies")

  useEffect(() => {
    fetchUsers()
    fetchCompanies()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/superadmin/users")
      setUsers(response.data)
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

  const handleAddCompany = async () => {
    if (!newCompany.companyName || !newCompany.shareValue || !newCompany.quantity) {
      return // Validation failed
    }

    try {
      setIsLoading(true)
      await api.post("/superadmin/companies", {
        companyName: newCompany.companyName,
        shareValue: Number.parseFloat(newCompany.shareValue),
        quantity: Number.parseInt(newCompany.quantity),
      })

      // Reset form and refresh companies
      setNewCompany({
        companyName: "",
        shareValue: "",
        quantity: "",
      })
      fetchCompanies()
    } catch (err) {
      console.error("Error adding company")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCompany = async (id) => {
    try {
      setIsLoading(true)
      await api.delete(`/superadmin/companies/${id}`)
      fetchCompanies()
    } catch (err) {
      console.error("Error deleting company")
    } finally {
      setIsLoading(false)
    }
  }

  const handleShareChange = async (id, action) => {
    try {
      setIsLoading(true)
      await api.patch(`/superadmin/companies/${id}`, { action, value: 1 })

      // Update UI immediately for better UX
      setCompanies((prevCompanies) =>
        prevCompanies.map((c) =>
          c._id === id
            ? {
                ...c,
                shareValue: action === "increase" ? c.shareValue + 1 : c.shareValue - 1,
              }
            : c,
        ),
      )
    } catch (err) {
      console.error("Error changing share value")
      // Refresh to ensure data consistency
      fetchCompanies()
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCompanies = companies.filter((company) =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredUsers = users.filter((user) => user.email.toLowerCase().includes(searchTerm.toLowerCase()))

  const getRoleBadge = (role) => {
    switch (role) {
      case "superadmin":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300">
            Super Admin
          </Badge>
        )
      case "subadmin":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
            Sub Admin
          </Badge>
        )
      case "customer":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300">
            Customer
          </Badge>
        )
      default:
        return <Badge>{role}</Badge>
    }
  }

  const getInitials = (email) => {
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Super Admin Dashboard</h2>
            <p className="text-slate-500 dark:text-slate-400">Manage companies, shares, and users</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={() => {
                fetchUsers()
                fetchCompanies()
              }}
              className="border-slate-300 dark:border-slate-600"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Data
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <Card className="border-none shadow-lg bg-white dark:bg-slate-800">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <CardTitle className="text-xl text-slate-800 dark:text-slate-100">Dashboard Overview</CardTitle>
                  <CardDescription>Key metrics at a glance</CardDescription>
                </div>
                <div className="mt-4 md:mt-0 relative w-full md:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-none shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Companies</p>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{companies.length}</p>
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                        <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-none shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Users</p>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{users.length}</p>
                      </div>
                      <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full">
                        <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-none shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Customers</p>
                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                          {users.filter((user) => user.role === "customer").length}
                        </p>
                      </div>
                      <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-full">
                        <UserCog className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="companies" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-6">
              <TabsTrigger value="companies" className="text-sm">
                <Building2 className="mr-2 h-4 w-4" /> Companies
              </TabsTrigger>
              <TabsTrigger value="users" className="text-sm">
                <Users className="mr-2 h-4 w-4" /> Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="companies" className="mt-0">
              <Card className="border-none shadow-lg bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 dark:text-slate-100">Add New Company</CardTitle>
                  <CardDescription>Create a new company in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Company Name</label>
                      <Input
                        type="text"
                        placeholder="Enter company name"
                        value={newCompany.companyName}
                        onChange={(e) => setNewCompany({ ...newCompany, companyName: e.target.value })}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Share Value ($)</label>
                      <Input
                        type="number"
                        placeholder="Enter share value"
                        value={newCompany.shareValue}
                        onChange={(e) => setNewCompany({ ...newCompany, shareValue: e.target.value })}
                        className="w-full"
                        min="0.01"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-500 dark:text-slate-400">Quantity</label>
                      <Input
                        type="number"
                        placeholder="Enter quantity"
                        value={newCompany.quantity}
                        onChange={(e) => setNewCompany({ ...newCompany, quantity: e.target.value })}
                        className="w-full"
                        min="1"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleAddCompany}
                    disabled={isLoading || !newCompany.companyName || !newCompany.shareValue || !newCompany.quantity}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Company
                  </Button>
                </CardFooter>
              </Card>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Manage Companies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompanies.map((company) => (
                    <Card
                      key={company._id}
                      className="border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-slate-800 dark:text-slate-100">
                          {company.companyName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Share Value</p>
                            <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center">
                              <DollarSign className="inline h-4 w-4 mr-1 text-emerald-500" />
                              {company.shareValue.toFixed(2)}
                            </p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Quantity</p>
                            <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center">
                              <Package className="inline h-4 w-4 mr-1 text-blue-500" />
                              {company.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleShareChange(company._id, "increase")}
                            className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                          >
                            <ArrowUp className="mr-1 h-4 w-4" /> Increase
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleShareChange(company._id, "decrease")}
                            className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/30"
                          >
                            <ArrowDown className="mr-1 h-4 w-4" /> Decrease
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCompany(company._id)}
                            className="flex-1 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                          >
                            <Trash2 className="mr-1 h-4 w-4" /> Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-0">
              <Card className="border-none shadow-lg bg-white dark:bg-slate-800">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800 dark:text-slate-100">User Management</CardTitle>
                  <CardDescription>View and manage all users in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>
                            <Avatar className="h-8 w-8 bg-slate-100 dark:bg-slate-700">
                              <AvatarFallback className="text-xs">{getInitials(user.email)}</AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="font-medium">{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit User</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminPage

