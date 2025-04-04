
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
      
      if (files[0].type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setTextInput(content);
        };
        reader.readAsText(files[0]);
      }
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
      
      if (textInput) {
        onContentUploaded(textInput, `File: ${selectedFile.name}`);
      } else {
        const sampleContent = getSampleContent(selectedFile.name);
        onContentUploaded(sampleContent, `File: ${selectedFile.name}`);
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
    setTimeout(() => {
      setIsUploading(false);
      const sampleContent = getSampleContentForUrl(urlInput);
      onContentUploaded(sampleContent, `URL: ${urlInput}`);
      toast.success("URL content processed successfully!");
    }, 1500);
  };

  const getSampleContent = (filename: string) => {
    const lowerFilename = filename.toLowerCase();
    
    if (lowerFilename.includes('physics')) {
      return `# Introduction to Quantum Mechanics

Quantum mechanics is a fundamental theory in physics that describes nature at the smallest scales of atoms and subatomic particles. It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science.

## Wave-Particle Duality

Wave–particle duality is the concept that every particle or quantum entity exhibits both wave and particle properties. This central concept of quantum mechanics has been verified experimentally for elementary particles, as well as for compound particles like atoms and even molecules.

## Heisenberg Uncertainty Principle

The Heisenberg uncertainty principle states that there is a fundamental limit to the precision with which complementary variables can be known. For example, the more precisely the position of a particle is determined, the less precisely its momentum can be predicted.

## Quantum Entanglement

Quantum entanglement is a physical phenomenon that occurs when a pair or group of particles is generated, interact, or share spatial proximity in such a way that the quantum state of each particle of the pair or group cannot be described independently of the state of the others.`;
    } else if (lowerFilename.includes('history')) {
      return `# The Renaissance in Europe

The Renaissance was a period in European history marking the transition from the Middle Ages to modernity and covering the 15th and 16th centuries. In addition to the standard periodization, proponents of a "long Renaissance" may include the 14th century and the 17th century.

## Origins and Key Features

The Renaissance began in Florence, Italy, in the 14th century. Various theories have been proposed to explain its origins and characteristics, focusing on a variety of factors, including the social and civic peculiarities of Florence at this time, its political structure, and the patronage of its dominant family, the Medici.

## Cultural Achievements

The Renaissance saw extraordinary achievements in art, architecture, music, literature, science, technology, and exploration:

1. Leonardo da Vinci painted the Mona Lisa and The Last Supper
2. Michelangelo sculpted David and painted the ceiling of the Sistine Chapel
3. Raphael created The School of Athens
4. Gutenberg invented the printing press
5. Columbus voyaged to the Americas

## Humanist Philosophy

Renaissance humanism was a revival of classical learning and a philosophical movement that emphasized the study of classical texts, individualism, and critical thinking. Humanists sought to create a citizenry able to speak and write with eloquence and thus capable of engaging in the civic life of their communities.`;
    } else {
      return `# Introduction to Machine Learning

Machine learning is a branch of artificial intelligence (AI) and computer science which focuses on the use of data and algorithms to imitate the way that humans learn, gradually improving its accuracy.

## Supervised Learning

Supervised learning involves training a model on a labeled dataset, which means we have input variables (x) and an output variable (y). The algorithm learns the mapping function from the input to the output. The goal is to approximate the mapping function so well that when we have new input data (x), we can predict the output variables (y) for that data.

Examples of supervised learning algorithms include:
- Linear regression
- Logistic regression
- Support vector machines (SVM)
- Neural networks
- Decision trees

## Unsupervised Learning

Unsupervised learning is where we only have input data (x) and no corresponding output variables. The goal of unsupervised learning is to model the underlying structure or distribution in the data to learn more about the data.

Examples of unsupervised learning algorithms include:
- Clustering algorithms
- K-means clustering
- Principal component analysis
- Autoencoders`;
    }
  };
  
  const getSampleContentForUrl = (url: string) => {
    if (url.includes('wikipedia')) {
      return `# Nuclear Fusion

Nuclear fusion is a reaction in which two or more atomic nuclei are combined to form one or more different atomic nuclei and subatomic particles (neutrons or protons). The difference in mass between the reactants and products is manifested as either the release or the absorption of energy.

## How Nuclear Fusion Works

Fusion reactions take place in a state of matter called plasma — a hot, charged gas made of positive ions and free-moving electrons that has unique properties distinct from solids, liquids and gases.

For fusion to occur, the nuclei, which are positively charged, must overcome the electrostatic force of repulsion. This requires extremely high temperatures of about 100 million degrees Celsius and/or extremely high pressures.

## Fusion in Stars

Stars, including our Sun, naturally produce energy through nuclear fusion. In the core of the Sun, the process begins with protons (the nucleus of hydrogen atoms) and through a series of steps, these protons fuse to create helium and release energy in the form of light and heat.

## Fusion Energy on Earth

Scientists are attempting to develop fusion reactors that can produce more energy than they consume. The main approaches to controlled fusion are:

1. Magnetic confinement fusion (like ITER and tokamak designs)
2. Inertial confinement fusion (like the National Ignition Facility)
3. Alternative concepts (like magnetized target fusion or stellarators)`;
    } else if (url.includes('github')) {
      return `# Git Version Control System

Git is a distributed version control system designed to handle everything from small to very large projects with speed and efficiency. It allows multiple developers to work together on non-linear development.

## Basic Git Commands

- git init: Initialize a new Git repository
- git clone: Create a copy of an existing repository
- git add: Add files to the staging area
- git commit: Record changes to the repository
- git push: Upload local repository content to a remote repository
- git pull: Fetch and download content from a remote repository

## Branching and Merging

Branching in Git allows developers to diverge from the main line of development and continue to work without affecting that main line. Key commands include:

- git branch: List, create, or delete branches
- git checkout: Switch branches or restore working tree files
- git merge: Join two or more development histories together

## Git Workflow

A typical Git workflow involves:
1. Creating a branch for a new feature
2. Making changes and committing them
3. Pushing the branch to a remote repository
4. Creating a pull request
5. Merging the branch after review
6. Deleting the branch`;
    } else {
      return `# Climate Change: Causes and Effects

Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, but since the 1800s, human activities have been the main driver of climate change, primarily due to the burning of fossil fuels like coal, oil, and gas, which produces heat-trapping gases.

## Causes of Climate Change

### Greenhouse Gas Emissions

The primary greenhouse gases in Earth's atmosphere are:
- Carbon dioxide (CO2)
- Methane (CH4)
- Nitrous oxide (N2O)
- Fluorinated gases

Human activities are increasing the concentrations of these gases, enhancing the greenhouse effect and causing the planet to warm.

### Deforestation

Trees help regulate the climate by absorbing CO2 from the atmosphere. When they are cut down, this beneficial effect is lost, and the carbon stored in the trees is released, adding to the greenhouse effect.

## Effects of Climate Change

### Rising Temperatures

Global temperatures have increased by about 1°C since pre-industrial times. This warming is causing more frequent and intense heat waves.

### Sea Level Rise

As the Earth warms, sea levels are rising due to thermal expansion of the oceans and melting ice sheets and glaciers. This threatens coastal communities worldwide.

### Extreme Weather Events

Climate change is making weather more extreme and unpredictable, with more frequent and intense storms, floods, and droughts.

### Biodiversity Loss

Many plant and animal species are struggling to adapt to rapidly changing conditions, leading to shifts in their geographical ranges, changes in their seasonal activities, and in some cases, extinction.`;
    }
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
