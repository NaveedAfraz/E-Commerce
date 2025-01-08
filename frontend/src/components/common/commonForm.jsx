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
export const CommonForm = ({
  formComponentDetails,
  formData,
  setFormData,
  onSubmit,
  buttonText,
}) => {
  const renderComponentType = (formComponentDetail) => {
    // console.log(formComponentDetail);
    const value = formData[formComponentDetail.name] || "";
    switch (formComponentDetail.componentType) {
      case "input": {
        return (
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
      }
      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }
    }
  };
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
