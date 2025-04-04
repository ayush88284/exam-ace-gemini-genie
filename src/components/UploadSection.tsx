import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, Link, MessageSquare, FilePlus2 } from "lucide-react";
import { toast } from "sonner";

interface UploadSectionProps {
  onContentUploaded: (content: string, contentSource: string) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onContentUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      toast.success(`File selected: ${files[0].name}`);
      
      // Always try to read the file content when a file is selected
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileContent(content);
      };
      reader.readAsText(files[0]);
    }
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }
    
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      
      // IMPORTANT: Always use the actual file content if available
      if (fileContent) {
        onContentUploaded(fileContent, `File: ${selectedFile.name}`);
      } else {
        // Fallback to the text input content if for some reason file reading failed
        if (textInput) {
          onContentUploaded(textInput, `File: ${selectedFile.name}`);
        } else {
          toast.error("Could not read file content. Try pasting the content in the Text tab.");
          return;
        }
      }
      
      toast.success("File processed successfully!");
    }, 1500);
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) {
      toast.error("Please enter some text");
      return;
    }
    
    onContentUploaded(textInput, "Direct text input");
    toast.success("Text submitted successfully!");
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error("Please enter a URL");
      return;
    }
    
    setIsUploading(true);
    
    // For demonstration purposes, we'll use a simplified approach here
    // In a real app, you'd make an actual request to fetch the content from the URL
    
    fetch(urlInput)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch URL content');
        }
        return response.text();
      })
      .then(content => {
        setIsUploading(false);
        onContentUploaded(content, `URL: ${urlInput}`);
        toast.success("URL content processed successfully!");
      })
      .catch(error => {
        setIsUploading(false);
        console.error("Error fetching URL:", error);
        toast.error("Failed to fetch URL content. Please try another URL or method.");
      });
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Upload Your Study Material</h2>
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="file" className="flex items-center gap-2 flex-1">
              <FilePlus2 className="h-4 w-4" />
              <span>Document</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2 flex-1">
              <MessageSquare className="h-4 w-4" />
              <span>Text</span>
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2 flex-1">
              <Link className="h-4 w-4" />
              <span>URL</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="file" className="space-y-4">
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
              <FileUp className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload PDF, DOC, PPT, or other document formats
              </p>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>Browse Files</span>
                </Button>
              </label>
              {selectedFile && (
                <p className="mt-2 text-sm font-medium">{selectedFile.name}</p>
              )}
            </div>
            <Button 
              onClick={handleFileUpload} 
              disabled={!selectedFile || isUploading} 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
            >
              {isUploading ? "Processing..." : "Upload & Process"}
            </Button>
          </TabsContent>
          
          <TabsContent value="text" className="space-y-4">
            <Textarea 
              placeholder="Paste your study material here..." 
              className="min-h-[200px] resize-none"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <Button 
              onClick={handleTextSubmit} 
              disabled={!textInput.trim()} 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
            >
              Process Text
            </Button>
          </TabsContent>
          
          <TabsContent value="url" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enter the URL of a webpage containing study material
              </p>
              <Input 
                placeholder="https://example.com/study-material" 
                type="url" 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <Button 
                onClick={handleUrlSubmit} 
                disabled={!urlInput.trim() || isUploading} 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
              >
                {isUploading ? "Processing..." : "Fetch & Process"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UploadSection;
