"use client"

import { getIncomes } from "@/services/incomes.services"
import { Income } from "@/types"
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
import { Trash } from "lucide-react"
import { FunctionComponent, useCallback, useEffect, useState } from "react"
import { IncomeDataTable } from "../data-tables/income-table/income-data-table"

export type LastIncomesProps = {
  [key: string]: unknown
}

export const LastIncomes: FunctionComponent<LastIncomesProps> = () => {
  const [incomes, setIncomes] = useState<Income[]>([])
  const [selectedRows, setSelectedRows] = useState<Income[]>([])
  const [perPage, setPerPage] = useState<number>(5)
  useEffect(() => {
    // Fetch the last 5 incomes from your API or data source
    ;(async () => {
      const response = await getIncomes({ perPage: perPage })
      if (response.success) {
        setIncomes(response.data ?? []) // Update state with fetched incomes
      }
    })()
  }, [perPage])
  const handleRowSelection = useCallback(
    (row: Income[]) => {
      setSelectedRows(row)
    },
    [setSelectedRows]
  )
  return (
    <div className="px-4">
      <Card>
        <CardHeader>
          <div className="space-y-1">
            <CardTitle>Incomes</CardTitle>
            <CardDescription>
              Track income details and amounts at a glance.
            </CardDescription>
          </div>
          <CardAction className="hidden gap-2 md:flex">
            {selectedRows.length > 0 && (
              <Button variant={"destructive"}>
                <Trash />
                Delete ({selectedRows.length})
              </Button>
            )}
          </CardAction>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <IncomeDataTable
            incomes={incomes}
            handleRowSelection={handleRowSelection}
          />
        </CardContent>
        <CardFooter className="flex items-center justify-end">
          <Select
            value={perPage.toString()}
            onValueChange={(value) => setPerPage(Number(value))}
            defaultValue="5"
          >
            <SelectTrigger>
              <SelectValue placeholder="Total" />
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
