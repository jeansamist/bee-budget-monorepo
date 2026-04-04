"use client"

import { useScopedI18n } from "@/lib/i18n/client"
import {
  deleteMassInternalTransfers,
  getInternalTransfers,
} from "@/services/internal-transfers.services"
import { InternalTransfer } from "@/types"
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
import { Loader, Trash } from "lucide-react"
import { FunctionComponent, useCallback, useEffect, useState } from "react"
import { Confirm } from "../confirm"
import { InternalTransferDataTable } from "../data-tables/internal-transfer-table/internal-transfer-data-table"

export const LastInternalTransfers: FunctionComponent = () => {
  const t = useScopedI18n("app.dashboard.lastInternalTransfers")
  const [transfers, setTransfers] = useState<InternalTransfer[]>([])
  const [deleting, setDeleting] = useState(false)
  const [selectedRows, setSelectedRows] = useState<InternalTransfer[]>([])
  const [perPage, setPerPage] = useState<number>(5)
  const [fetchVersion, setFetchVersion] = useState(0)

  useEffect(() => {
    ;(async () => {
      const response = await getInternalTransfers({ perPage })
      if (response.success) {
        setTransfers(response.data ?? [])
      }
    })()
  }, [perPage, fetchVersion])

  const handleRowSelection = useCallback((rows: InternalTransfer[]) => {
    setSelectedRows(rows)
  }, [])

  const handleDelete = useCallback(async () => {
    setDeleting(true)
    setTransfers((prev) => prev.filter((transfer) => !selectedRows.includes(transfer)))
    await deleteMassInternalTransfers(selectedRows.map((transfer) => transfer.id))
    setDeleting(false)
    setSelectedRows([])
    setFetchVersion((version) => version + 1)
  }, [selectedRows])

  return (
    <div className="px-4">
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
          <InternalTransferDataTable
            transfers={transfers}
            handleRowSelection={handleRowSelection}
            resetSelectionTrigger={fetchVersion}
            onDeleted={() => setFetchVersion((version) => version + 1)}
          />
        </CardContent>
        <CardFooter className="flex items-center justify-end">
          <Select
            value={perPage.toString()}
            onValueChange={(value) => setPerPage(Number(value))}
            defaultValue="5"
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
