
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      toast.success(`File selected: ${files[0].name}`);
    }
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }
    
    setIsUploading(true);
    // In a real application, we would upload the file to a server here
    setTimeout(() => {
      setIsUploading(false);
      // For demo purposes, we're just pretending to extract the text
      onContentUploaded(`Content from ${selectedFile.name}`, `File: ${selectedFile.name}`);
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
    // In a real application, we would fetch the content from the URL here
    setTimeout(() => {
      setIsUploading(false);
      onContentUploaded(`Content from ${urlInput}`, `URL: ${urlInput}`);
      toast.success("URL content processed successfully!");
    }, 1500);
  };

  return (
    <Card className="examace-card w-full">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4 examace-gradient-text">Upload Your Study Material</h2>
        <Tabs defaultValue="file" className="w-full">
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
                accept=".pdf,.doc,.docx,.ppt,.pptx"
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
              className="w-full examace-gradient-bg"
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
              className="w-full examace-gradient-bg"
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
                className="w-full examace-gradient-bg"
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
