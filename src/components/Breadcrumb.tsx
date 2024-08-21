import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "./ui/breadcrumb"

export function BreadcrumbResponsive() {
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
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="/components">Components</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <input
          type="text"
          placeholder="Breadcrumb"
          className="cursor-pointer"
          onClick={handleInputClick}
          readOnly
        />
      </BreadcrumbItem>
    </Breadcrumb>
  )
}
