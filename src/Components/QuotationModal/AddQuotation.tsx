import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AddButton } from "../CustomButtons/AddButton";
import { CancelBtn } from "../CustomButtons/CancelBtn";
import { Title } from "../Title";
import { InputField } from "../InputFields/InputField";

import { BASE_URL } from "../../Content/URL";
import { useAppSelector } from "../../redux/Hooks";

type AddQuotationProps = {
  setModal: () => void;
  onAdded?: () => void;
};

type Customer = {
  id: string;
  customerName: string;
};

type Project = {
  id: string;
  projectName: string;
};

type CartItem = {
  id: string;
  projectId: string;
  projectName: string;
  description: string;
  QTY: number;
  UnitPrice: number;
  isEditing?: boolean;
};

const initialState = {
  description: "",
  QTY: "",
  UnitPrice: "",
};

export const AddQuotation = ({ setModal, onAdded }: AddQuotationProps) => {
  const { currentUser } = useAppSelector((state) => state.officeState);
  const token = currentUser?.token;

  const [addQuotation, setAddQuotation] = useState(initialState);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [cart, setCart] = useState<CartItem[]>(() => {
    const storedCart = sessionStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [date, setDate] = useState(
    () => new Date().toLocaleDateString('sv-SE')
  );

  useEffect(() => {
    const getAllProjects = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/getProjects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data || []);
      } catch (error) {
        console.log("Error fetching projects:", error);
      }
    };

    const getAllCustomers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/getAllCustomers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(res.data || []);
      } catch (error) {
        console.log("Error fetching customers:", error);
      }
    };

    getAllProjects();
    getAllCustomers();
  }, [token]);

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setAddQuotation((prev) => ({
      ...prev,
      [name]: type === "number" ? value.replace(/\D/g, "") : value,
    }));
  };

  const isAddToCartDisabled =
    !selectedProject ||
    !addQuotation.QTY ||
    Number(addQuotation.QTY) <= 0 ||
    !addQuotation.UnitPrice ||
    Number(addQuotation.UnitPrice) <= 0 ||
    !addQuotation.description.trim();

  const addToCart = () => {
    if (!selectedProject) return toast.error("Please select a project");
    const qty = Number(addQuotation.QTY);
    const price = Number(addQuotation.UnitPrice);
    const desc = addQuotation.description.trim();

    if (!qty || qty <= 0) return toast.error("Enter a valid QTY");
    if (!price || price <= 0) return toast.error("Enter a valid Unit Price");
    if (!desc) return toast.error("Enter a description");

    const project = projects.find((p) => p.id.toString() === selectedProject);
    if (!project) return toast.error("Selected project not found");

    const newItem: CartItem = {
      id: crypto.randomUUID(),
      projectId: project.id,
      projectName: project.projectName,
      description: desc,
      QTY: qty,
      UnitPrice: price,
      isEditing: false,
    };

    setCart((prev) => [newItem, ...prev]);
    toast.success("Item added to cart");

    setAddQuotation(initialState);
    setSelectedProject("");
  };

  const handlerSubmitted = async () => {
    if (!cart.length) return toast.error("Please add items before submitting");
    if (!selectedCustomer) return toast.error("Please select a customer.");

    try {
      const payload = {
        date,
        customerId: selectedCustomer,
        items: cart,
        subTotal,
        totalBill,
      };
      await axios.post(`${BASE_URL}/api/admin/addQuotation`, payload, {
        headers: { Authorization: token },
      });

      toast.success("Quotation added successfully.");
      setCart([]);
      sessionStorage.removeItem("cart");
      setAddQuotation(initialState);
      setSelectedProject("");
      setSelectedCustomer("");

      if (onAdded) onAdded();

      setModal();
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit quotation.");
    }
  };

  const subTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.QTY * item.UnitPrice, 0);
  }, [cart]);

  const totalBill = subTotal;

  const closeModal = () => {
    setCart([]);
    sessionStorage.removeItem("cart");
    setAddQuotation(initialState);
    setSelectedProject("");
    setSelectedCustomer("");
    setModal();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-[48rem] max-h-[100vh] overflow-y-auto bg-white rounded-2xl border border-indigo-900 shadow-lg  p-2">
        <div className="bg-indigo-900 rounded-t-xl px-6">
          <Title
            setModal={setModal}
            className="text-white text-lg font-semibold"
          >
            Add Quotation
          </Title>
        </div>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 py-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Project*
              </label>
              <select
                className="w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-indigo-900"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectName}
                  </option>
                ))}
              </select>
            </div>
            <InputField
              labelName="QTY*"
              type="number"
              name="QTY"
              handlerChange={handlerChange}
              value={addQuotation.QTY}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              labelName="Unit Price*"
              type="number"
              name="UnitPrice"
              handlerChange={handlerChange}
              value={addQuotation.UnitPrice}
            />
            <InputField
              labelName="Description*"
              name="description"
              handlerChange={handlerChange}
              value={addQuotation.description}
            />
          </div>

          <div className="flex justify-end gap-2">
            <AddButton
              label="Add to Cart"
              handleClick={addToCart}
              disabled={isAddToCartDisabled}
            />
          </div>
        </div>

        <div className="mt-6 border rounded-lg overflow-hidden">
          <div className="grid grid-cols-6 bg-indigo-900 text-sm text-white font-semibold border-b text-center">
            <span className="pt-2 pb-2">Sr</span>
            <span className="p-2">Project</span>
            <span className="p-2">Description</span>
            <span className="p-2">QTY</span>
            <span className="p-2">Unit Price</span>
            <span className="p-2">Actions</span>
          </div>

          {cart.length === 0 ? (
            <div className="text-center text-gray-400 p-4 text-sm">
              No items in cart
            </div>
          ) : (
            cart.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-6 text-sm border-b hover:bg-indigo-900 text-center items-center gap-1"
              >
                <span>{index + 1}</span>
                <span>{item.projectName}</span>

                {item.isEditing ? (
                  <>
                    <input
                      type="text"
                      className="border rounded p-1 text-sm"
                      value={item.description}
                      onChange={(e) => {
                        const updatedCart = [...cart];
                        updatedCart[index].description = e.target.value;
                        setCart(updatedCart);
                      }}
                    />
                    <input
                      type="number"
                      className="border rounded p-1 text-sm"
                      value={item.QTY}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value < 0) return;
                        const updatedCart = [...cart];
                        updatedCart[index].QTY = value;
                        setCart(updatedCart);
                      }}
                    />
                    <input
                      type="number"
                      className="border rounded p-1 text-sm"
                      value={item.UnitPrice}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value < 0) return;
                        const updatedCart = [...cart];
                        updatedCart[index].UnitPrice = value;
                        setCart(updatedCart);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <span>{item.description}</span>
                    <span>{item.QTY}</span>
                    <span>{item.UnitPrice}</span>
                  </>
                )}

                <span className="flex justify-center gap-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => {
                      const updatedCart = [...cart];
                      updatedCart[index].isEditing =
                        !updatedCart[index].isEditing;
                      setCart(updatedCart);
                    }}
                  >
                    {item.isEditing ? "Save" : "Edit"}
                  </button>
                </span>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 py-2">
          <label className="text-sm font-semibold text-gray-700 mb-1 block">
            Customer*
          </label>
          <select
            className="w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-indigo-900"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="">Please select customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.customerName}
              </option>
            ))}
          </select>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">
                Date*
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border rounded p-2 text-sm focus:ring-1 focus:ring-indigo-900"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 mb-1 block">
                Sub Total*
              </label>
              <input
                type="number"
                value={subTotal}
                readOnly
                className="w-full border rounded p-2 text-sm bg-gray-100"
              />
            </div>
          </div>
          <div className="mt-2">
            <label className="font-semibold text-gray-700 mb-1 block">
              Total Bill*
            </label>
            <input
              type="number"
              value={totalBill}
              readOnly
              className="w-full border rounded p-2 text-sm bg-gray-100"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-4 rounded-b-xl py-2 bg-indigo-900 border-t border-indigo-900">
          <CancelBtn setModal={closeModal} />
          <AddButton label="Save" handleClick={handlerSubmitted} />
        </div>
      </div>
    </div>
  );
};
