// var tsort = require("tsort"); // HINT!!! This is a useful package for one of the methods

class PermissionDependencyResolver {
  constructor(dependencies) {
    this.dependencies = dependencies;
  }

  canGrant(existing, permToBeGranted) {
    // A function for checking if the dependencies for a new permission exist
    // Check if the existing permissions are valid
    // Iterate through the existing permissions and dependencies
    // If a dependency matches an existing permission then add to the counter
    // If the counter matches the length of the dependencies then return true

    if(this.isValid(existing)){
      var exists = 0
      existing.forEach(existingPerm => {
        this.dependencies[permToBeGranted].forEach( perm => {
          if(existingPerm === perm){
            exists += 1
          }
        })
      });
      if(exists === this.dependencies[permToBeGranted].length) {
        return true
      }
      return false
    }
    throw InvalidBasePermissionsError
  }

  canDeny(existing, permToBeDenied) {
    // Function to check if a permission can be removed and still satisfy all dependencies
    // Check if the existing permissions are valid
    // return false if the existing permission rely on the permission to be removed
    // return true if it can be removed
    if(this.isValid(existing)){
      for(var i = 0; i < existing.length; i++) {
        if(this.dependencies[existing[i]].includes(permToBeDenied)){
          return false
        }
      }
      return true
    }
    throw InvalidBasePermissionsError
  }

  sort(permissions) {
    // A function to sort a list of permissions by chance 
    // of satisfying dependencies
    // Iterate through each element in permissions as x
    // Check if any element in permissions is a dependent of x
    // If it is a dependent of x then switch the positions
    // return permissions
    for(var x = 0; x < permissions.length; x++) {
      for(var y = 0; y < permissions.length; y++) {
        if(this.dependencies[permissions[y]].includes(permissions[x])){
          permissions[y] = permissions.splice(x, 1, permissions[y])[0]
        }
      }
    }
    return permissions
  }

  isValid(existing) {
    // A function for checking if an array of existing permissions are valid
    // Iterate through each element of the existing permissions
    // Check its dependencies
    // If a dependency doesnt exist in existing permissions then return false
    // return true if all dependencies are in existing
    for(var x = 0; x < existing.length; x++){
      var perm = existing[x]
      for(var y = 0; y < this.dependencies[perm].length; y++){
        if(!existing.includes(this.dependencies[perm][y])){
          return false
        }
      }
    }
    return true
  }

}


// you'll need to throw this in canGrant and canDeny when the existing permissions are invalid
class InvalidBasePermissionsError extends Error {
  constructor(_message) {
    super("Invalid Base Permissions");
    this.name = "InvalidBasePermissionsError";
  }
}

module.exports = PermissionDependencyResolver;
