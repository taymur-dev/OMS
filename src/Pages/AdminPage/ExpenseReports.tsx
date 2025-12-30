import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../Content/URL";

import { TableTitle } from "../../Components/TableLayoutComponents/TableTitle";
import { ShowDataNumber } from "../../Components/Pagination/ShowDataNumber";
import { Pagination } from "../../Components/Pagination/Pagination";
import { InputField } from "../../Components/InputFields/InputField";
import { OptionField } from "../../Components/InputFields/OptionField";
import { TableInputField } from "../../Components/TableLayoutComponents/TableInputField";
import { Loader } from "../../Components/LoaderComponent/Loader";

import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import {
  navigationStart,
  navigationSuccess,
} from "../../redux/NavigationSlice";

type ExpenseT = {
  id: number;
  expenseName: string;
  categoryName: string;
  expenseCategoryId: number;
  amount: number;
  date: string;
};

type CategoryT = {
  id: number;
  categoryName: string;
};

const pageSizes = [10, 25, 50];

export const ExpenseReports = () => {
  const { currentUser } = useAppSelector((s) => s.officeState);
  const { loader } = useAppSelector((s) => s.NavigateState);
  const dispatch = useAppDispatch();
  const token = currentUser?.token;

  const today = new Date().toISOString().split("T")[0];

  const [pageNo, setPageNo] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [expenses, setExpenses] = useState<ExpenseT[]>([]);
  const [categories, setCategories] = useState<CategoryT[]>([]);

  const [filters, setFilters] = useState({
    startDate: today,
    endDate: today,
    expenseCategoryId: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPageNo(1);
  };

  const getExpenses = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getExpense`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const getExpenseCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/getExpenseCategory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    document.title = "(OMS) EXPENSE REPORTS";
    dispatch(navigationStart());

    getExpenses();
    getExpenseCategories();

    setTimeout(() => {
      dispatch(navigationSuccess("EXPENSE REPORTS"));
    }, 800);
  }, [dispatch, getExpenses, getExpenseCategories]);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((e) => e.date >= filters.startDate && e.date <= filters.endDate)
      .filter((e) =>
        filters.expenseCategoryId
          ? e.expenseCategoryId.toString() === filters.expenseCategoryId
          : true
      )
      .filter((e) =>
        `${e.expenseName} ${e.categoryName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
  }, [expenses, filters, searchTerm]);

  const paginatedData = filteredExpenses.slice(
    (pageNo - 1) * limit,
    pageNo * limit
  );

  if (loader) return <Loader />;

  return (
    <div className="w-full mx-2">
      <TableTitle tileName="Expense Report" activeFile="Expense Report" />

      <div className="flex items-center justify-between py-2 mx-2">
        <div>
          Show{" "}
          <select
            className="mx-2 border rounded p-1"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPageNo(1);
            }}
          >
            {pageSizes.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          entries
        </div>

        <TableInputField
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      <div className="shadow-lg border-t-2 rounded border-indigo-500 bg-white">
        <div className="flex gap-3 px-6 py-3">
          <InputField
            labelName="From"
            type="date"
            name="startDate"
            value={filters.startDate}
            handlerChange={handleChange}
          />
          <InputField
            labelName="To"
            type="date"
            name="endDate"
            value={filters.endDate}
            handlerChange={handleChange}
          />
          <OptionField
            labelName="Expense Category"
            name="expenseCategoryId"
            value={filters.expenseCategoryId}
            inital="All Categories"
            optionData={categories.map((c) => ({
              id: c.id,
              label: c.categoryName,
              value: c.id,
            }))}
            handlerChange={handleChange}
          />
        </div>

        <div className="max-h-[28rem] overflow-y-auto">
          <div className="grid grid-cols-5 bg-gray-200 font-semibold p-2 sticky top-0">
            <span>Sr#</span>
            <span>Category</span>
            <span>Expense</span>
            <span>Amount</span>
            <span>Date</span>
          </div>

          {paginatedData.map((e, index) => (
            <div
              key={e.id}
              className="grid grid-cols-5 border p-2 text-sm hover:bg-gray-100"
            >
              <span>{(pageNo - 1) * limit + index + 1}</span>
              <span>{e.categoryName}</span>
              <span>{e.expenseName}</span>
              <span>{e.amount}</span>
              <span>{e.date}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <ShowDataNumber
          start={(pageNo - 1) * limit + 1}
          end={Math.min(pageNo * limit, filteredExpenses.length)}
          total={filteredExpenses.length}
        />
        <Pagination
          pageNo={pageNo}
          handleIncrementPageButton={() => setPageNo((p) => p + 1)}
          handleDecrementPageButton={() => setPageNo((p) => Math.max(p - 1, 1))}
        />
      </div>
    </div>
  );
};
