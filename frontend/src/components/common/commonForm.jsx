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
    switch (formComponentDetail.componentType) {
      case "input": {
        <Input
          name={formComponentDetail.name}
          placeholder={formComponentDetail.placeholder}
          id={formComponentDetail.name}
          type={formComponentDetail.type}
          value={value}
          onChange={() => {
            setFormData({
              ...formData,
              [formComponentDetail.name]: e.target.value,
            });
          }}
        />;
      }
    }
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        {formComponentDetails.map((formDetail) => {
          <div className="grid w-full gap-1.5" key={formDetail.name}>
            <Label className="mb-1">{formDetail.label}</Label>
            <br />
            {renderComponentType(formDetail)}
          </div>;
        })}
      </form>
    </div>
  );
};
