import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Description } from "@radix-ui/react-dialog";
export const CommonForm = ({
  formComponentDetails,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) => {
  const renderComponentType = (formComponentDetail) => {
    //  console.log(formComponentDetail);
    //  console.log(formData); 
    // const nameChanged = {
    //   ...formData,
    //   category: formData.cat,
    //   description: formData.desc,
    // };
    const value = formData[formComponentDetail.name] || "";
    let element;
    // console.log("currentedited ID", formData);
    switch (formComponentDetail.componentType) {
      case "input":
        element = (
          <Input
            name={formComponentDetail.name}
            placeholder={formComponentDetail.placeholder}
            id={formComponentDetail.name}
            type={formComponentDetail.type}
            value={value}
            onChange={(e) => {
              setFormData({
                ...formData,
                [formComponentDetail.name]: e.target.value,
              });
            }}
          />
        );
        break;
      case "select":
        //   console.log(formComponentDetail);
        //   console.log(formData);
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,

                [formComponentDetail.name]: value,
              })
            }
            value={formData[formComponentDetail.name]}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={formComponentDetail.label} />
            </SelectTrigger>
            <SelectContent>
              {formComponentDetail.options &&
              formComponentDetail.options.length > 0
                ? formComponentDetail.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      default:
        element = (
          <Input
            name={formComponentDetail.name}
            placeholder={formComponentDetail.placeholder}
            id={formComponentDetail.name}
            type={formComponentDetail.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [formComponentDetail.name]: event.target.value,
              })
            }
          />
        );
        break;
    }
   // console.log(formData);
    return element;
  };
  // console.log(formComponentDetails);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-3">
          {formComponentDetails.map((formDetail) => {
            return (
              <>
                <div className="grid w-full gap-1.5" key={formDetail.name}>
                  <Label className="mb-1 text-l">{formDetail.label}</Label>
               
                  {renderComponentType(formDetail)}
                </div>
              </>
            );
          })}
          <Button type="submit" className="w-full mt-4">
            {buttonText}
          </Button>
        </div>
      </form>
    </div>
  );
};
