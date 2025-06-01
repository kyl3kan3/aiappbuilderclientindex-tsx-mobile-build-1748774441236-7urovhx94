import React from "react";
import { useState } from "react";
import { useModels } from "../store/useModels";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  Database,
  Edit3,
  Check,
  X
} from "lucide-react";
import { FieldType } from "../types/models";

export function ModelBuilder() {
  const { 
    models, 
    selectedModelId, 
    addModel, 
    updateModel, 
    removeModel, 
    selectModel,
    addField,
    updateField,
    removeField,
    getModel,
    exportModels,
    importModels
  } = useModels();

  const [newModelName, setNewModelName] = useState("");
  const [newModelDescription, setNewModelDescription] = useState("");
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  const selectedModel = selectedModelId ? getModel(selectedModelId) : null;

  const handleCreateModel = () => {
    if (newModelName.trim()) {
      addModel(newModelName.trim(), newModelDescription.trim());
      setNewModelName("");
      setNewModelDescription("");
    }
  };

  const handleAddField = () => {
    if (selectedModelId) {
      addField(selectedModelId, {
        name: "newField",
        type: "string",
        required: false
      });
    }
  };

  const handleExport = () => {
    const json = exportModels();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data-models.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const json = e.target?.result as string;
        importModels(json);
      };
      reader.readAsText(file);
    }
  };

  const fieldTypes: { value: FieldType; label: string }[] = [
    { value: "string", label: "Text" },
    { value: "number", label: "Number" },
    { value: "boolean", label: "True/False" },
    { value: "date", label: "Date" },
    { value: "email", label: "Email" },
    { value: "url", label: "URL" }
  ];

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar - Model List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold">Data Models</h1>
          </div>
          
          <div className="space-y-3">
            <Input
              placeholder="Model name (e.g., User, Product)"
              value={newModelName}
              onChange={(e) => setNewModelName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateModel()}
            />
            <Input
              placeholder="Description (optional)"
              value={newModelDescription}
              onChange={(e) => setNewModelDescription(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateModel()}
            />
            <Button onClick={handleCreateModel} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Create Model
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-2">
            {models.map((model) => (
              <Card
                key={model.id}
                className={`cursor-pointer transition-colors ${
                  selectedModelId === model.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => selectModel(model.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{model.name}</h3>
                      <p className="text-sm text-gray-500">
                        {model.fields.length} fields
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeModel(model.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <Button onClick={handleExport} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <label>
                <Upload className="w-4 h-4 mr-2" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Model Editor */}
      <div className="flex-1 flex flex-col">
        {selectedModel ? (
          <>
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedModel.name}</h2>
                  {selectedModel.description && (
                    <p className="text-gray-600 mt-1">{selectedModel.description}</p>
                  )}
                </div>
                <Button onClick={handleAddField}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-4">
                {selectedModel.fields.map((field) => (
                  <Card key={field.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          {editingFieldId === field.id ? (
                            <Input
                              value={field.name}
                              onChange={(e) => updateField(selectedModel.id, field.id, { name: e.target.value })}
                              onBlur={() => setEditingFieldId(null)}
                              onKeyPress={(e) => e.key === 'Enter' && setEditingFieldId(null)}
                              autoFocus
                            />
                          ) : (
                            <div 
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => setEditingFieldId(field.id)}
                            >
                              <span className="font-medium">{field.name}</span>
                              <Edit3 className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                        </div>

                        <select
                          value={field.type}
                          onChange={(e) => updateField(selectedModel.id, field.id, { type: e.target.value as FieldType })}
                          className="border border-gray-300 rounded-md px-3 py-2"
                        >
                          {fieldTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>

                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={field.required || false}
                            onChange={(e) => updateField(selectedModel.id, field.id, { required: e.target.checked })}
                            className="rounded"
                          />
                          <span className="text-sm">Required</span>
                        </label>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeField(selectedModel.id, field.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {selectedModel.fields.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No fields yet. Add your first field to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No Model Selected</h3>
              <p>Create or select a data model to start designing your data structure.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}