import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useTheme } from "@/hooks/use-theme";
import { InputField } from "@/components/InputField";
import { DataTable, DataTableColumn } from "@/components/DataTable";
import { useState } from "react";
import { Github, Moon, Sun } from "lucide-react";
import NotFound from "@/pages/not-found";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  lastActive: string;
}

const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "active",
    lastActive: "2 hours ago"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Editor",
    status: "active",
    lastActive: "5 minutes ago"
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "Viewer",
    status: "inactive",
    lastActive: "1 day ago"
  },
  {
    id: "4",
    name: "Alice Wilson",
    email: "alice.wilson@example.com",
    role: "Editor",
    status: "pending",
    lastActive: "3 hours ago"
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "Admin",
    status: "active",
    lastActive: "1 hour ago"
  }
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Toggle theme"
      data-testid="theme-toggle"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
}

function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedRows, setSelectedRows] = useState<User[]>([]);

  const columns: DataTableColumn<User>[] = [
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
      sortable: true,
      render: (value, record) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-primary">
              {record.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">@{value.toLowerCase().replace(' ', '')}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
      sortable: true,
    },
    {
      key: "role",
      title: "Role",
      dataIndex: "role",
      sortable: true,
      render: (value) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
          {value}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      sortable: true,
      render: (value) => {
        const statusColors = {
          active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
          pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        };
        
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[value as keyof typeof statusColors]}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1"></span>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      },
    },
    {
      key: "lastActive",
      title: "Last Active",
      dataIndex: "lastActive",
      sortable: true,
    },
  ];

  const handleRowSelect = (selectedRows: User[], selectedKeys: string[]) => {
    setSelectedRows(selectedRows);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-foreground">My Components</h1>
              <span className="ml-3 px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md">
                v1.0.0
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            React Component Library Demo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A modern, accessible component library built with React, TypeScript, and Tailwind CSS. 
            Featuring flexible InputField and DataTable components with comprehensive functionality.
          </p>
        </div>

        {/* InputField Demo */}
        <section className="mb-16">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-foreground mb-2">InputField Component</h3>
            <p className="text-muted-foreground">
              Flexible input component with multiple variants, sizes, and accessibility features.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="text-lg font-medium text-card-foreground mb-4">Basic Examples</h4>
              <div className="space-y-6">
                <InputField
                  label="Search"
                  placeholder="Search users..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  clearable
                  helperText="Search for users by name or email"
                />
                
                <InputField
                  label="Password"
                  placeholder="Enter your password"
                  password
                  variant="filled"
                />
                
                <InputField
                  label="Email (with error)"
                  placeholder="Enter your email"
                  errorMessage="Please enter a valid email address"
                  invalid
                />
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="text-lg font-medium text-card-foreground mb-4">Variants & Sizes</h4>
              <div className="space-y-6">
                <InputField
                  label="Small Outlined"
                  placeholder="Small input"
                  size="sm"
                  variant="outlined"
                />
                
                <InputField
                  label="Medium Filled"
                  placeholder="Medium input"
                  size="md"
                  variant="filled"
                />
                
                <InputField
                  label="Large Ghost"
                  placeholder="Large input"
                  size="lg"
                  variant="ghost"
                />
              </div>
            </div>
          </div>
        </section>

        {/* DataTable Demo */}
        <section className="mb-16">
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-foreground mb-2">DataTable Component</h3>
            <p className="text-muted-foreground">
              Responsive data table with sorting, selection, and accessibility features.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <h4 className="text-lg font-medium text-card-foreground">Users Table</h4>
                  <span className="text-sm text-muted-foreground">
                    {sampleUsers.length} items
                  </span>
                </div>
                {selectedRows.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {selectedRows.length} of {sampleUsers.length} rows selected
                  </div>
                )}
              </div>
            </div>

            <DataTable
              data={sampleUsers}
              columns={columns}
              selectable
              onRowSelect={handleRowSelect}
              rowKey="id"
            />
          </div>
        </section>

        {/* Technical Details */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="text-lg font-medium text-card-foreground mb-4">
                Accessibility Features
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>ARIA labels and descriptions for screen readers</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Keyboard navigation support with focus indicators</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>High contrast ratios for text and interactive elements</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Semantic HTML structure with proper headings</span>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="text-lg font-medium text-card-foreground mb-4">
                Technical Stack
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-foreground">Frontend</span>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    <li>React 18</li>
                    <li>TypeScript</li>
                    <li>Tailwind CSS</li>
                    <li>Vite</li>
                  </ul>
                </div>
                <div>
                  <span className="font-medium text-foreground">Testing</span>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    <li>Vitest</li>
                    <li>React Testing Library</li>
                    <li>Storybook</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Built with React, TypeScript, Tailwind CSS, and ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
