/**
 * Package Templates System
 * Quick start templates for creating packages
 */
export interface PackageTemplate {
    id: string;
    name: string;
    description: string;
    contentType: string;
    files: Array<{
        path: string;
        content: string;
        executable?: boolean;
    }>;
    variables?: string[];
}
/**
 * Predefined templates
 */
export declare const PACKAGE_TEMPLATES: PackageTemplate[];
/**
 * Get template by ID
 */
export declare function getTemplate(templateId: string): PackageTemplate | undefined;
/**
 * List all templates
 */
export declare function listTemplates(contentType?: string): PackageTemplate[];
/**
 * Create package from template
 */
export declare function createFromTemplate(templateId: string, packageName: string, variables: Record<string, string>, outputDir: string): Promise<void>;
//# sourceMappingURL=templates.d.ts.map