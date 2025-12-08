import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User,
  Building2,
  FileText,
  Save,
  Plus,
  Edit3,
  Trash2,
  Clock,
  Phone,
  Mail,
  MapPin,
  RefreshCw
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "general", label: "General Info", icon: User },
  { id: "business", label: "Business Info", icon: Building2 },
  { id: "templates", label: "Reply Templates", icon: FileText },
];

const mockTemplates = [
  { id: 1, name: "Positive Review Response", tone: "Friendly", preview: "Thank you so much for your wonderful review! We're thrilled to hear..." },
  { id: 2, name: "Negative Review Apology", tone: "Apologetic", preview: "We sincerely apologize for your experience. This is not the level of..." },
  { id: 3, name: "Follow-up Request", tone: "Professional", preview: "We appreciate your feedback and would love to learn more about..." },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <AppLayout title="Settings" subtitle="Manage your account and preferences">
      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-card text-muted-foreground hover:bg-muted border border-border/50"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Info Tab */}
      {activeTab === "general" && (
        <div className="bg-card rounded-2xl border border-border/50 p-6">
          <h3 className="font-display font-bold text-lg mb-6">Personal Information</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Full Name
              </label>
              <Input defaultValue="John Smith" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Email Address
              </label>
              <Input type="email" defaultValue="john@business.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Phone Number
              </label>
              <Input type="tel" defaultValue="+1 (555) 123-4567" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Time Zone
              </label>
              <Input defaultValue="Pacific Time (PT)" />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border/50">
            <h4 className="font-medium text-foreground mb-4">Notification Preferences</h4>
            <div className="space-y-3">
              {["Email notifications for new reviews", "Daily digest summary", "Urgent review alerts"].map((pref, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border bg-muted accent-primary" />
                  <span className="text-sm text-muted-foreground">{pref}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button variant="neon">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* Business Info Tab */}
      {activeTab === "business" && (
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border/50 p-6">
            <h3 className="font-display font-bold text-lg mb-6">Business Details</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Business Name
                </label>
                <Input defaultValue="Smith's Dental Care" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Industry
                </label>
                <Input defaultValue="Healthcare / Dental" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-10" defaultValue="123 Main Street, San Francisco, CA 94102" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-10" defaultValue="+1 (555) 987-6543" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-10" defaultValue="contact@smithsdental.com" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border/50 p-6">
            <h3 className="font-display font-bold text-lg mb-6">Business Hours</h3>
            
            <div className="space-y-3">
              {[
                { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
                { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
                { day: "Sunday", hours: "Closed" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <span className="text-sm font-medium text-foreground">{item.day}</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{item.hours}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border/50 p-6">
            <h3 className="font-display font-bold text-lg mb-6">Policies (for AI context)</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Refund Policy
                </label>
                <textarea 
                  className="w-full h-24 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Describe your refund policy..."
                  defaultValue="We offer full refunds within 30 days if the customer is not satisfied with the service. Partial refunds may be available on a case-by-case basis."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Callback Policy
                </label>
                <textarea 
                  className="w-full h-24 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Describe your callback policy..."
                  defaultValue="We aim to return all calls within 24 business hours. For urgent matters, please call our main line."
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="neon">
                <Save className="w-4 h-4" />
                Save Business Info
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-display font-bold text-lg">Reply Templates</h3>
              <p className="text-sm text-muted-foreground">Create reusable templates for common review responses</p>
            </div>
            <Button variant="neon">
              <Plus className="w-4 h-4" />
              Add Template
            </Button>
          </div>

          <div className="grid gap-4">
            {mockTemplates.map((template) => (
              <div key={template.id} className="bg-card rounded-2xl border border-border/50 p-6 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-foreground">{template.name}</h4>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        template.tone === "Friendly" && "bg-primary/20 text-primary",
                        template.tone === "Apologetic" && "bg-accent/20 text-accent",
                        template.tone === "Professional" && "bg-secondary/20 text-secondary"
                      )}>
                        {template.tone}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{template.preview}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Template Editor Placeholder */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 border-dashed">
            <div className="text-center py-8">
              <RefreshCw className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="font-medium text-foreground mb-2">Template Editor</h4>
              <p className="text-sm text-muted-foreground mb-4">Click "Add Template" to create a new response template</p>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Settings;
