import React, { useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"

export function BreadcrumbResponsive() { 
  const [inputValue, setInputValue] = useState("My Dashboard");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputClick = () => {
    console.log("Simulating API call...");
    // Here you would typically make an actual API call
    // For now, we'll just use a setTimeout to simulate an asynchronous operation
    setTimeout(() => {
      console.log("API call completed!");
    }, 1000);
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onClick={handleInputClick}
              className="border-transparent hover:border hover:border-black cursor-text"
            />
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
