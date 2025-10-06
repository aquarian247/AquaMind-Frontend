# Domain Implementation Session Checklist

Use this checklist before and during each domain CRUD implementation session (I1.x, B2.x, INV3.x, H4.x, etc.).

---

## Pre-Implementation (5-10 minutes)

### 1. API Verification
- [ ] **Sync OpenAPI spec** if backend changes suspected:
  ```bash
  cd /Users/aquarian247/Projects/AquaMind-Frontend
  npm run sync:openapi
  ```

- [ ] **Verify endpoints exist** in generated client:
  ```bash
  grep "apiV1{Domain}{Entity}" client/src/api/generated/services/ApiService.ts
  ```
  - Confirm: List, Create, Retrieve, Update, PartialUpdate, Destroy

- [ ] **Check model types** for the entity:
  - Open `client/src/api/generated/models/{Entity}.ts`
  - Note readonly fields (id, created_at, updated_at, calculated fields)
  - Note required vs optional fields
  - Note field types (string, number, enum)
  - Note relationships (foreign keys)

- [ ] **Review filtering options** in service method signature:
  ```typescript
  public static apiV1DomainEntitiesList(
    name?: string,        // Note available filters
    active?: boolean,
    ordering?: string,
    page?: number,
    // ...
  )
  ```

- [ ] **Check for special endpoints**:
  - Summary/aggregate endpoints
  - Bulk operations
  - Custom actions
  - FIFO operations (inventory)

### 2. Validation Schema Check
- [ ] **Confirm schema exists** in `client/src/lib/validation/`:
  - `{domain}.ts` file exists
  - Schema exported (e.g., `geographySchema`)
  - Type exported (e.g., `GeographyFormValues`)

- [ ] **If schema missing**, create it:
  1. Reference generated model type
  2. Use utilities from `validation/utils/`
  3. Export schema and type
  4. Add to `validation/index.ts`
  5. Write tests in `validation/__tests__/`

### 3. Permission Requirements
- [ ] **Identify permission level** needed:
  - Admin only? (`UserRole.ADMIN`)
  - Manager or higher? (`UserRole.MGR`)
  - Write access? (exclude `UserRole.VIEW`)
  - Geography-specific?
  - Subsidiary-specific?

- [ ] **Plan permission gates**:
  - Where to apply `<PermissionGate>`?
  - Which buttons need `<WriteGate>` or `<DeleteGate>`?
  - Any custom permission logic needed?

---

## During Implementation

### 4. Component Structure
- [ ] **Follow feature slice pattern**:
  ```
  features/{domain}/
  ├── api.ts           # TanStack Query hooks
  ├── hooks.ts         # Custom business logic hooks
  ├── pages/           # Page components (route targets)
  ├── components/      # Domain-specific presentational components
  └── __tests__/       # Tests
  ```

- [ ] **Use form layout primitives** from F0.1:
  - `<FormLayout>` for overall structure
  - `<FormSection>` for grouped fields
  - `<FormActions>` for button layout
  - `<FormHelpText>` for field descriptions

- [ ] **Integrate React Hook Form**:
  ```tsx
  const form = useForm<EntityFormValues>({
    resolver: zodResolver(entitySchema),
    defaultValues: { /* ... */ }
  })
  ```

### 5. Mutation Implementation
- [ ] **Use useCrudMutation** from F0.1:
  ```tsx
  const createMutation = useCrudMutation({
    mutationFn: ApiService.apiV1DomainEntitiesCreate,
    description: 'Entity created successfully',
    invalidateQueries: ['entities'],
  })
  ```

- [ ] **Add audit support** for delete operations:
  ```tsx
  const { promptReason, dialogState } = useAuditReasonPrompt()
  
  const deleteMutation = useCrudMutation({
    mutationFn: ApiService.apiV1DomainEntitiesDestroy,
    description: 'Entity deleted',
    invalidateQueries: ['entities'],
    injectAuditReason: (vars, reason) => ({ ...vars, change_reason: reason })
  })
  
  const handleDelete = async () => {
    const { confirmed, reason } = await promptReason({
      title: 'Confirm Delete',
      required: true
    })
    if (confirmed) {
      await deleteMutation.mutateAsync({ id, __auditReason: reason })
    }
  }
  
  // Don't forget to render:
  <AuditReasonDialog {...dialogState} />
  ```

- [ ] **Apply permission gates**:
  ```tsx
  <WriteGate>
    <Button type="submit">Save</Button>
  </WriteGate>
  
  <DeleteGate>
    <Button onClick={handleDelete}>Delete</Button>
  </DeleteGate>
  ```

### 6. Query Implementation
- [ ] **Create query hooks** in `features/{domain}/api.ts`:
  ```tsx
  export function useEntities(filters = {}) {
    return useQuery({
      queryKey: ['entities', filters],
      queryFn: () => ApiService.apiV1DomainEntitiesList(filters)
    })
  }
  ```

- [ ] **Handle pagination** if needed:
  - Use TanStack Query pagination
  - Or `fetchAllPages` utility for bulk data

- [ ] **Cache related data**:
  - Prefetch dropdown options
  - Invalidate related queries on mutations

### 7. Error Handling
- [ ] **Toast notifications**:
  - Success: Handled by `useCrudMutation` automatically
  - Error: Handled by `normalizeError` automatically
  - Custom: Use `toast()` directly if needed

- [ ] **Field-level errors**:
  - `<FormMessage />` displays field errors automatically
  - Backend 400 responses map to form fields

- [ ] **Permission errors**:
  - Show access denied message
  - Hide write operations for VIEW role

---

## Testing Strategy

### 8. Unit Tests
- [ ] **Validation schema tests** (if new schema):
  - Required field validation
  - Range constraints
  - Enum validation
  - Transformation/coercion

- [ ] **Permission logic tests** (if custom logic):
  - Role hierarchy
  - Geography filtering
  - Subsidiary filtering

- [ ] **Hook tests** (if complex business logic):
  - State management
  - Error handling
  - Query invalidation

### 9. Component Tests
- [ ] **Form component tests**:
  - Renders without crashing
  - Required field validation
  - Submit success flow
  - Submit error flow
  - Cancel/reset behavior

- [ ] **Permission gate tests**:
  - Shows/hides content based on role
  - Shows fallback when denied

- [ ] **Integration tests** (if complex workflow):
  - Multi-step forms
  - Dependent dropdowns
  - Wizard navigation

### 10. Manual QA (Phase 1+)
- [ ] Form renders correctly in light/dark themes
- [ ] Validation errors display inline
- [ ] Submit button states work (loading, disabled)
- [ ] Success/error toasts appear
- [ ] Responsive layout on mobile/tablet/desktop
- [ ] Keyboard navigation works
- [ ] Date pickers show correct format
- [ ] Select dropdowns populate from API
- [ ] Permission gates hide/show correctly

---

## Common Patterns Reference

### Foreign Key Dropdowns
```tsx
const { data: species } = useQuery({
  queryKey: ['species'],
  queryFn: () => ApiService.apiV1BatchSpeciesList()
})

<Select>
  {species?.results.map(s => (
    <SelectItem key={s.id} value={s.id.toString()}>
      {s.name}
    </SelectItem>
  ))}
</Select>
```

### Date Pickers (use Shadcn date-picker)
```tsx
<FormField
  control={form.control}
  name="start_date"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Start Date</FormLabel>
      <FormControl>
        <Input type="date" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Enum Fields
```tsx
<FormField
  control={form.control}
  name="status"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Status</FormLabel>
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Boolean Fields
```tsx
<FormField
  control={form.control}
  name="active"
  render={({ field }) => (
    <FormItem className="flex items-center space-x-2">
      <FormControl>
        <input
          type="checkbox"
          checked={field.value}
          onChange={field.onChange}
          className="h-4 w-4"
        />
      </FormControl>
      <FormLabel>Active</FormLabel>
    </FormItem>
  )}
/>
```

### Decimal Fields
```tsx
<FormField
  control={form.control}
  name="max_biomass"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Maximum Biomass (kg)</FormLabel>
      <FormControl>
        <Input
          type="number"
          step="0.01"
          placeholder="100000.00"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## Troubleshooting

### Issue: Validation Schema Doesn't Match API
**Solution**: Regenerate client and check model types
```bash
npm run sync:openapi
npm run generate:api
```

### Issue: Permission Gate Not Working
**Solution**: Verify user role in AuthContext
```tsx
const { user } = useAuth()
console.log('User role:', user?.role)
```

### Issue: Audit Reason Not Captured
**Solution**: Ensure dialog is rendered and `injectAuditReason` is configured
```tsx
<AuditReasonDialog {...dialogState} />  // Must be in JSX
```

### Issue: Query Not Invalidating
**Solution**: Check query key matches in mutation and query
```tsx
// Query
queryKey: ['containers']

// Mutation
invalidateQueries: ['containers']  // Must match
```

---

## Quick Command Reference

```bash
# Sync OpenAPI spec from backend
npm run sync:openapi

# Regenerate API client
npm run generate:api

# Type checking
npm run type-check

# Run tests (targeted)
npm run test -- infrastructure
npm run test -- batch

# Run full test suite
npm run test

# Note: No npm run lint script exists (expected)
```

---

**Version**: 1.0  
**Last Updated**: 2025-10-06 (F0.4)  
**Maintained By**: Frontend Team
