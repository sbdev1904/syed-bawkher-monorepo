"use client";
import React, { useState } from "react";
import { MinusCircle, Plus, Search } from "lucide-react";
import fabricService from "../../services/fabricService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UseFormReturn } from "react-hook-form";

// Types
type FabricOption = {
  value: string;
  label: string;
};

type ItemType = "jacket" | "shirt" | "pant";

interface Item {
  item_name: string;
  item_type: ItemType;
  fabric_id?: string;
  lining_fabric_id?: string;
  key: string;
}

interface FormValues {
  items: Item[];
}

interface VisibilityState {
  displayJacketForm: boolean;
  displayShirtForm: boolean;
  displayPantForm: boolean;
}

interface AddItemsFormProps {
  form: UseFormReturn<FormValues>;
  formData: FormValues;
  setFormData: (data: FormValues) => void;
  setVisibility: (visibility: VisibilityState) => void;
}

const AddItemsForm: React.FC<AddItemsFormProps> = ({
  form,
  formData,
  setFormData,
  setVisibility
}) => {
  const [fabricOptions, setFabricOptions] = useState<FabricOption[]>([]);
  const [liningOptions, setLiningOptions] = useState<FabricOption[]>([]);
  const [fabricOpen, setFabricOpen] = useState<{ [key: number]: boolean }>({});
  const [liningOpen, setLiningOpen] = useState<{ [key: number]: boolean }>({});
  const [fabricSearchInput, setFabricSearchInput] = useState<string>("");
  const [liningSearchInput, setLiningSearchInput] = useState<string>("");

  // Function to fetch fabrics based on search query
  const fetchFabrics = async (query: string, setOptionsCallback: React.Dispatch<React.SetStateAction<FabricOption[]>>) => {
    if (!query) {
      setOptionsCallback([]); // Reset options if the query is empty
      return;
    }
    try {
      const results = await fabricService.searchFabrics(query);
      const options = results.map((fabric: any) => ({
        value: fabric.fabric_id,
        label: `${fabric.fabric_id} - ${fabric.fabric_brand} (${fabric.fabric_code})`,
      }));
      setOptionsCallback(options);
    } catch (error) {
      console.error("Failed to search fabrics:", error);
    }
  };

  // Function to update visibility based on items
  const updateVisibility = (_: any, allValues: any) => {
    const items = allValues.items || [];
    setVisibility({
      displayJacketForm: items.some((item: any) => item.item_type === "jacket"),
      displayShirtForm: items.some((item: any) => item.item_type === "shirt"),
      displayPantForm: items.some((item: any) => item.item_type === "pant"),
    });
  };

  // Function to ensure items have unique keys
  const getUniqueKey = () => {
    return new Date().getTime() + Math.random().toString(16).slice(2);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => { })} className="mt-10">
        <div className="space-y-5">
          {form.getValues().items?.map((item, index) => (
            <div
              key={item.key || index}
              className="grid grid-cols-1 md:grid-cols-9 gap-5 items-center"
            >
              <div className="md:col-span-1 grid place-items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const currentItems = form.getValues().items;
                    const newItems = currentItems.filter((_, i) => i !== index);
                    form.setValue('items', newItems);
                    updateVisibility(null, { items: newItems });
                  }}
                >
                  <MinusCircle className="text-red-500" size={20} />
                </Button>
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name={`items.${index}.item_name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter item name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name={`items.${index}.item_type`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue(`items.${index}.item_type`, value as ItemType);
                          updateVisibility(null, form.getValues());
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an item type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jacket">Jacket</SelectItem>
                          <SelectItem value="shirt">Shirt</SelectItem>
                          <SelectItem value="pant">Pant</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name={`items.${index}.fabric_id`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover
                        open={fabricOpen[index]}
                        onOpenChange={(open) => setFabricOpen({ ...fabricOpen, [index]: open })}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full justify-between"
                            >
                              {field.value
                                ? fabricOptions.find(option => option.value === field.value)?.label || field.value
                                : "Enter fabric code"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-0">
                          <div className="p-2 flex items-center border-b">
                            <Search className="h-4 w-4 mr-2 opacity-50" />
                            <Input
                              placeholder="Search fabrics..."
                              className="border-none h-8 flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                              value={fabricSearchInput}
                              onChange={(e) => {
                                setFabricSearchInput(e.target.value);
                                fetchFabrics(e.target.value, setFabricOptions);
                              }}
                            />
                          </div>
                          <div className="max-h-60 overflow-y-auto">
                            {fabricOptions.length > 0 ? (
                              <div className="py-1">
                                {fabricOptions.map((option) => (
                                  <div
                                    key={option.value}
                                    className="px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={() => {
                                      form.setValue(`items.${index}.fabric_id`, option.value);
                                      setFabricOpen({ ...fabricOpen, [index]: false });
                                    }}
                                  >
                                    {option.label}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="px-2 py-4 text-center text-sm text-gray-500">
                                No fabrics found
                              </div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {form.getValues().items[index]?.item_type === "jacket" && (
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.lining_fabric_id`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover
                          open={liningOpen[index]}
                          onOpenChange={(open) => setLiningOpen({ ...liningOpen, [index]: open })}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full justify-between"
                              >
                                {field.value
                                  ? liningOptions.find(option => option.value === field.value)?.label || field.value
                                  : "Enter lining code"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-72 p-0">
                            <div className="p-2 flex items-center border-b">
                              <Search className="h-4 w-4 mr-2 opacity-50" />
                              <Input
                                placeholder="Search lining fabrics..."
                                className="border-none h-8 flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                                value={liningSearchInput}
                                onChange={(e) => {
                                  setLiningSearchInput(e.target.value);
                                  fetchFabrics(e.target.value, setLiningOptions);
                                }}
                              />
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                              {liningOptions.length > 0 ? (
                                <div className="py-1">
                                  {liningOptions.map((option) => (
                                    <div
                                      key={option.value}
                                      className="px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                      onClick={() => {
                                        form.setValue(`items.${index}.lining_fabric_id`, option.value);
                                        setLiningOpen({ ...liningOpen, [index]: false });
                                      }}
                                    >
                                      {option.label}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="px-2 py-4 text-center text-sm text-gray-500">
                                  No lining fabrics found
                                </div>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              const currentItems = form.getValues().items || [];
              form.setValue('items', [
                ...currentItems,
                {
                  item_type: "jacket" as ItemType,
                  item_name: "",
                  key: getUniqueKey()
                }
              ]);
              updateVisibility(null, form.getValues());
            }}
          >
            <Plus size={16} className="mr-2" />
            Add Item
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddItemsForm;
