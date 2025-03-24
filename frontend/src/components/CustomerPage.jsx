"use client"

import { useState, useEffect } from "react"
import api from "../api"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUpIcon,
  ArrowDownIcon,
  BarChart3,
  DollarSign,
  Briefcase,
  RefreshCw,
  TrendingUp,
  History,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionHistory } from "../components/TransactionHistory"
import { SharePriceChart } from "./SharePriceChart"

const CustomerPage = () => {
  const [portfolio, setPortfolio] = useState([])
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [transactions, setTransactions] = useState([])
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)

  useEffect(() => {
    fetchPortfolio()
    fetchTransactionHistory()
  }, [])

  const fetchPortfolio = async () => {
    try {
      setIsLoading(true)
      const customer = JSON.parse(localStorage.getItem("StockUser"))
      const customerId = customer?._id
      console.log(customerId)
      const response = await api.get(`/portfolio/${customerId}`)
      setPortfolio(response.data.portfolio)
      setTotalPortfolioValue(response.data.totalPortfolioValue)
    } catch (err) {
      console.error("Error fetching portfolio")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTransactionHistory = async () => {
    try {
      setIsLoadingTransactions(true)
      const customer = JSON.parse(localStorage.getItem("StockUser"))
      const customerId = customer?._id
      const response = await api.get(`/transaction/history/customer/${customerId}`)
      setTransactions(response.data)
    } catch (err) {
      console.error("Error fetching transaction history:", err)
    } finally {
      setIsLoadingTransactions(false)
    }
  }

  const getPerformanceBadge = (performance) => {
    if (performance > 0) {
      return (
        <Badge className="ml-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
          <ArrowUpIcon className="w-3 h-3 mr-1" />
          {performance}%
        </Badge>
      )
    } else if (performance < 0) {
      return (
        <Badge variant="destructive" className="ml-2">
          <ArrowDownIcon className="w-3 h-3 mr-1" />
          {Math.abs(performance)}%
        </Badge>
      )
    }
    return null
  }

  const filteredPortfolio =
    activeTab === "all"
      ? portfolio
      : activeTab === "positive"
        ? portfolio.filter((company) => company.performance > 0)
        : portfolio.filter((company) => company.performance <= 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">My Portfolio</h2>
            <p className="text-slate-500 dark:text-slate-400">Track your investments and performance</p>
          </div>
          <Button
            onClick={() => {
              fetchPortfolio()
              fetchTransactionHistory()
            }}
            className="mt-4 md:mt-0 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Data
          </Button>
        </div>

        <Card className="mb-8 bg-white dark:bg-slate-800 border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
                  <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Portfolio Value</p>
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                    ${totalPortfolioValue.toFixed(2)}
                  </h3>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-full mx-auto mb-2">
                    <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Stocks</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{portfolio.length}</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mx-auto mb-2">
                    <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Performance</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    {portfolio.filter((c) => c.performance > 0).length >
                    portfolio.filter((c) => c.performance < 0).length
                      ? "↑"
                      : "↓"}
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full mx-auto mb-2">
                    <History className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Transactions</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{transactions.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        

        <Tabs defaultValue="portfolio" className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-slate-200 dark:bg-slate-700">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="history">Transaction History</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="portfolio" className="mt-0">
            <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <TabsList className="bg-slate-200 dark:bg-slate-700">
                  <TabsTrigger value="all">All Stocks</TabsTrigger>
                  <TabsTrigger value="positive">Positive</TabsTrigger>
                  <TabsTrigger value="negative">Negative</TabsTrigger>
                </TabsList>
              </div>

              {/* <TabsContent value="portfolio">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              portfolio.map((company) => (
                <SharePriceChart
                  key={10}
                  companyId={9090}
                  companyName={"hello"}
                  currentPrice={80}
                  onFetchHistory={async (companyId) => {
                    const response = await api.get(`/price-history/${companyId}`)
                    return response.data
                  }}
                />
              ))
            )}
          </TabsContent> */}


              

              <TabsContent value="all" className="mt-0">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                      <Card key={index} className="w-full border-none shadow-md">
                        <CardHeader className="space-y-2">
                          <Skeleton className="h-6 w-1/2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPortfolio.map((company) => (
                      <Card
                        key={company.companyName}
                        className="w-full border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800"
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center justify-between">
                            <span className="truncate">{company.companyName}</span>
                            {getPerformanceBadge(company.performance)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                              <p className="text-xs text-slate-500 dark:text-slate-400">Share Value</p>
                              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                <DollarSign className="inline h-4 w-4 mr-1" />
                                {company.shareValue.toFixed(2)}
                              </p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                              <p className="text-xs text-slate-500 dark:text-slate-400">Shares Owned</p>
                              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                {company.sharesOwned}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50 dark:bg-slate-700/30 pt-3 pb-3 px-6 rounded-b-lg">
                          <div className="w-full flex justify-between items-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total Value</p>
                            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                              ${company.totalValue.toFixed(2)}
                            </p>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="positive" className="mt-0">
                {/* Same content structure as "all" tab but with filtered data */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPortfolio.map((company) => (
                    <Card
                      key={company.companyName}
                      className="w-full border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center justify-between">
                          <span className="truncate">{company.companyName}</span>
                          {getPerformanceBadge(company.performance)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Share Value</p>
                            <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              <DollarSign className="inline h-4 w-4 mr-1" />
                              {company.shareValue.toFixed(2)}
                            </p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Shares Owned</p>
                            <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              {company.sharesOwned}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-slate-50 dark:bg-slate-700/30 pt-3 pb-3 px-6 rounded-b-lg">
                        <div className="w-full flex justify-between items-center">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Total Value</p>
                          <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                            ${company.totalValue.toFixed(2)}
                          </p>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="negative" className="mt-0">
                {/* Same content structure as "all" tab but with filtered data */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPortfolio.map((company) => (
                    <Card
                      key={company.companyName}
                      className="w-full border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center justify-between">
                          <span className="truncate">{company.companyName}</span>
                          {getPerformanceBadge(company.performance)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Share Value</p>
                            <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              <DollarSign className="inline h-4 w-4 mr-1" />
                              {company.shareValue.toFixed(2)}
                            </p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                            <p className="text-xs text-slate-500 dark:text-slate-400">Shares Owned</p>
                            <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                              {company.sharesOwned}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-slate-50 dark:bg-slate-700/30 pt-3 pb-3 px-6 rounded-b-lg">
                        <div className="w-full flex justify-between items-center">
                          <p className="text-sm text-slate-500 dark:text-slate-400">Total Value</p>
                          <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                            ${company.totalValue.toFixed(2)}
                          </p>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            {isLoadingTransactions ? (
              <Card className="w-full border-none shadow-md">
                <CardHeader className="space-y-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            ) : (
              <TransactionHistory transactions={transactions} viewType="customer" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default CustomerPage

