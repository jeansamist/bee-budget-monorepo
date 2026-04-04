"use client"

import { useScopedI18n } from "@/lib/i18n/client"
import { deleteMassExpenses, getExpenses } from "@/services/expenses.services"
import { Expense } from "@/types"
import { Button } from "@bee-budget/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@bee-budget/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@bee-budget/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@bee-budget/ui/pagination"
import { Loader, Trash } from "lucide-react"
import { FunctionComponent, useCallback, useEffect, useState } from "react"
import { Confirm } from "../confirm"
import { ExpenseDataTable } from "../data-tables/expense-table/expense-data-table"

export type ExpensesProps = {
  [key: string]: unknown
}

export const Expenses: FunctionComponent<ExpensesProps> = () => {
  const t = useScopedI18n("app.transactions.expenses")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [deleting, setDeleting] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Expense[]>([])
  const [perPage, setPerPage] = useState<number>(10)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)
  const [fetchVersion, setFetchVersion] = useState(0)

  useEffect(() => {
    ;(async () => {
      const response = await getExpenses({ page: currentPage, perPage })
      if (response.success) {
        setExpenses(response.data ?? [])
        setCurrentPage(response.meta?.currentPage ?? 1)
        setLastPage(response.meta?.lastPage ?? 1)
      }
    })()
  }, [currentPage, perPage, fetchVersion])

  const handleRowSelection = useCallback((rows: Expense[]) => {
    setSelectedRows(rows)
  }, [])

  const handleDelete = useCallback(async () => {
    setDeleting(true)
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => !selectedRows.includes(expense))
    )
    await deleteMassExpenses(selectedRows.map((expense) => expense.id))
    setDeleting(false)
    setSelectedRows([])
    setFetchVersion((version) => version + 1)
  }, [selectedRows])

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > lastPage || page === currentPage) return
      setCurrentPage(page)
    },
    [currentPage, lastPage]
  )

  return (
    <div className="">
      <Card>
        <CardHeader>
          <div className="space-y-1">
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <CardAction className="hidden gap-2 md:flex">
            {selectedRows.length > 0 && (
              <Confirm
                title={t("deleteConfirm.title")}
                content={t("deleteConfirm.content")}
                confirmText={t("deleteConfirm.confirm")}
                onConfirm={() => handleDelete()}
              >
                <Button variant={"destructive"} disabled={deleting}>
                  {deleting ? <Loader className="animate-spin" /> : <Trash />}
                  {deleting
                    ? t("deleting")
                    : t("deleteCount", {
                        count: selectedRows.length.toString().padStart(2, "0"),
                      })}
                </Button>
              </Confirm>
            )}
          </CardAction>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <ExpenseDataTable
            expenses={expenses}
            handleRowSelection={handleRowSelection}
            resetSelectionTrigger={fetchVersion}
            onDeleted={() => setFetchVersion((version) => version + 1)}
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Pagination className="mx-0 w-auto justify-start">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text={t("pagination.previous")}
                  onClick={(event) => {
                    event.preventDefault()
                    handlePageChange(currentPage - 1)
                  }}
                  className={
                    currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
                  }
                />
              </PaginationItem>
              {Array.from({ length: lastPage }, (_, index) => index + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={(event) => {
                      event.preventDefault()
                      handlePageChange(page)
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  text={t("pagination.next")}
                  onClick={(event) => {
                    event.preventDefault()
                    handlePageChange(currentPage + 1)
                  }}
                  className={
                    currentPage >= lastPage ? "pointer-events-none opacity-50" : undefined
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <Select
            value={perPage.toString()}
            onValueChange={(value) => {
              setCurrentPage(1)
              setPerPage(Number(value))
            }}
            defaultValue="10"
          >
            <SelectTrigger>
              <SelectValue placeholder={t("perPage.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardFooter>
      </Card>
    </div>
  )
}
