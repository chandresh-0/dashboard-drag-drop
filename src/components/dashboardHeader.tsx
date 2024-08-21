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

export function DashboardHeader() { 
  const [inputValue, setInputValue] = useState("My Dashboard");
  const handleInputChange = (e: any) => {
    console.log("Simulation API call...");
    
    setInputValue(e.target.value);
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e)}
              className="border-transparent hover:border hover:border-black cursor-text"
            />
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
